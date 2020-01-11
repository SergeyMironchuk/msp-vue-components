<!--suppress JSUnusedLocalSymbols -->
<script>
    import 'datatables.net-bs/css/dataTables.bootstrap.min.css'
    import 'datatables.net-buttons-bs/css/buttons.bootstrap.min.css'
    import $ from 'jquery'
    import 'datatables.net'
    import 'datatables.net-bs'
    import 'datatables.net-buttons-bs'
    import 'datatables.net-buttons/js/buttons.colVis.js'
    import MspColumn from './MspColumn'

    export default {
        name: "MspDataTable",
        props: {
            'dataSourceUrl': String,
            'className': String,
            'serverSide': Boolean,
            'dataSourceMethod': String,
            'refreshButtonIcon': String,
            'searchButtonIcon': String
        },
        render: function (createElement) {
            return createElement(
                'table',
                {
                    id: this.$attrs["id"],
                    style: {
                        width: "100%"
                    }
                },
                this.$slots.default
            )
        },
        components: {
            'msp-column': MspColumn
        },
        data: function () {
            return {
                columns: []
            }
        },
        methods: {
            refresh: function(){
                let tableElement = getTableDomElement(this);
                let dataTable = tableElement.DataTable();
                dataTable.draw();
            }
        },
        mounted: function () {
            let dataTableConfig = prepareDataTableConfigs(this.columns);
            let tableElement = getTableDomElement(this);
            tableElement.addClass(this.className);
            // noinspection SpellCheckingInspection
            let serverSide = this.serverSide;
            let method = this.dataSourceMethod ? this.dataSourceMethod : "GET";
            let dataTable = tableElement.DataTable({
                "processing": serverSide,
                "serverSide": serverSide,
                "ajax": {
                    "url": this.dataSourceUrl,
                    "type": serverSide ? "POST" : method,
                    "dataType": "json"
                },
                "columns": dataTableConfig.dtColumns,
                "columnDefs": dataTableConfig.dtColumnDefs,
                "buttons": ['colvis'],
                "dom":
                    '<"row no-gutters"' +
                        '<"col-sm-12 col-md-6 text-left"<"tableFilter">>' +
                        '<"col-sm-12 col-md-6 text-right"<"inlineBlock"l><"inlineBlock"B><"inlineBlock refreshTable">>' +
                    '>' +
                    '<"actions">' +
                    'rt' +
                    '<"row no-gutters"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>'
            });

            let columnComponents = this.columns;
            setTableFilter(this, columnComponents, tableElement, dataTable);
            setTableRefreshButton(this, tableElement);

            let tableComponent = this;
            tableElement.find('tbody').on( 'click', 'tr', function () {
                $(this).toggleClass('selected');
                let ids = dataTable.rows('.selected').data().map(d => d.id);
                tableComponent.$emit('row-selected', ids);
            });

            tableElement.parent().find('div.inlineBlock').each(function () {
                let inlineBlock = $(this);
                inlineBlock.css("display", "inline-block");
                inlineBlock.css("padding-left", "10px");
            });

            tableElement.on('click', '[action-id]', function () {
                let actionElement = $(this);
                processClickOnActionElement(actionElement, dataTable, columnComponents);
            });

            setAsyncElements(dataTable, tableElement, columnComponents);
        }
    };

    function getTableDomElement(tableComponent) {
        let id = tableComponent.$attrs["id"];
        return id ? $('table#' + id).first() : $('table').first();
    }

    function setAsyncElements(dataTable, tableElement, columnComponents) {
        dataTable.on('draw', function () {
            let asyncElementsData = getAllAsyncElementsData(tableElement, dataTable, columnComponents);
            if (0 === asyncElementsData.length) {
                return;
            }

            asyncElementsData.sort((a, b) => {
                if (a.columnNo > b.columnNo || (a.columnNo === b.columnNo && a.controlNo > b.controlNo)) {
                    return 1;
                }
                if (a.columnNo === b.columnNo && a.controlNo === b.controlNo) {
                    return 0;
                }
                if (a.columnNo < b.columnNo || (a.columnNo === b.columnNo && a.controlNo < b.controlNo)) {
                    return -1;
                }
            });
            let currentColumn = asyncElementsData[0].columnNo;
            let currentControl = asyncElementsData[0].controlNo;
            let promisesArray = [];
            for (let i = 0; i < asyncElementsData.length; i++) {
                let nextElementData = asyncElementsData[i];
                let asyncContent = nextElementData.asyncComponent.getAsyncContent(nextElementData.modelId, nextElementData);
                if (currentColumn === nextElementData.columnNo && currentControl === nextElementData.controlNo) {
                    promisesArray.push(asyncContent)
                } else {
                    fillAsyncElementsContent(promisesArray);
                    currentColumn = nextElementData.columnNo;
                    currentControl = nextElementData.controlNo;
                    promisesArray = [asyncContent];
                }
            }
            fillAsyncElementsContent(promisesArray);
        });
    }

    function templateTransform (templateComponent) {
        if (!templateComponent.$slots.default) {
            return "";
        }
        let templateElements = templateComponent.$slots.default.map(function (vNode) {
            // noinspection JSUnresolvedVariable
            return vNode.text ? vNode.text : vNode.elm.outerHTML;
        });
        let templateText = "<div>" + templateElements.join('').trim() + "</div>";
        return "'" + templateText
                .replace(/\r?\n|\r/g, "")
                .replace(/"/g, "\\'")
                .replace(/\[\[\s*if\([^[]*\)\s*\?\s*]]/g,
                    str => "'+(" + (
                        str.replace("[[", "")
                            .replace("]]", "")
                            .replace("if", "")) + "('")
                .replace(/\[\[\s*:\s*]]/g,
                    str => "')" + (
                        str.replace("[[", "")
                            .replace("]]", "")) + "'')+'")
                .replace(/\[\[/g, "'+")
                .replace(/]]/g, "+'")
                .replace(/^\+'/g, "")
                .replace(/'\+$/g, "")
        +"'";
    }

    function prepareDataTableConfigs (columnComponents) {
        let dataTableConfig = {
            dtColumns: [],
            dtColumnDefs: []
        };
        let columnNumber = 0;
        columnComponents.forEach(function (columnComponent) {
            let columnDef = {
                "targets": columnNumber,
                "title": columnComponent.header,
                "sortable": columnComponent.sortable ? columnComponent.sortable : false
            };
            if (columnComponent.className) {
                columnDef.className = columnComponent.className;
            }
            let modelProperty = columnComponent.$props.modelProperty;
            dataTableConfig.dtColumns.push({data: modelProperty ? modelProperty : null});

            let asyncContentTemplates = "";
            let asyncContentNumber = 0;
            columnComponent.asyncContents.forEach(function (asyncContent) {
                // noinspection HtmlUnknownAttribute
                asyncContentTemplates += `<span async-content-id='${columnNumber}_${asyncContentNumber}'>${asyncContent.spinTemplate}</span>`;
                asyncContentNumber++;
            });

            let actionTemplates = "";
            let actionNumber = 0;
            columnComponent.actions.forEach(function (action) {
                if (action.template) {
                    let html = $.parseHTML(`<span>${action.template}&nbsp;</span>`);
                    let htmlObject = $(html);
                    htmlObject.first().attr("action-id", columnNumber + "_" + actionNumber);
                    htmlObject.css('cursor', 'pointer');
                    actionTemplates += htmlObject.prop('outerHTML');
                    actionNumber++
                }
            });

            if (columnComponent.template) {
                let templateResult = templateTransform(columnComponent.template);
                // eslint-disable-next-line no-unused-vars
                columnDef.render = function (data, type, model) {
                    let templateAfterEval;
                    try {
                        // noinspection DynamicallyGeneratedCodeJS
                        templateAfterEval = eval(templateResult);
                    } catch (err) {
                        templateAfterEval = `Error in template: ${err.message}`;
                    }
                    return templateAfterEval + actionTemplates;
                };
            } else if ((actionTemplates || asyncContentTemplates) && columnComponent.$props.modelProperty) {
                // eslint-disable-next-line no-unused-vars
                columnDef.render = function (data, type, model) {
                    return data + asyncContentTemplates + actionTemplates;
                }
            } else if (actionTemplates || asyncContentTemplates) {
                // eslint-disable-next-line no-unused-vars
                columnDef.render = function (data, type, model) {
                    return asyncContentTemplates + actionTemplates;
                }
            }

            dataTableConfig.dtColumnDefs.push(columnDef);
            columnNumber++;
        }, this);

        return dataTableConfig;
    }

    function setTableFilter (tableComponent, columnComponents, tableElement, dataTable) {
        let columnsHtmlList = '';
        columnComponents.forEach(function (column) {
            // noinspection HtmlUnknownAttribute
            columnsHtmlList += `<li><a href="#" value="${column.header}">${column.header}</a></li>`;
        });
        tableElement.parent().find('div.tableFilter').each(function () {
            let tableFilter = $(this);
            tableFilter.html(`
                    <div class="input-group">
                      <div class="input-group-btn">
                        <button type="button" class="btn btn-default main">Select column...</button>
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="caret"></span>
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <ul class="dropdown-menu">
                        ${columnsHtmlList}
                        </ul>
                      </div>
                      <input type="text" class="form-control" aria-label="...">
                      <span class="input-group-btn">
                        <button type="button" class="btn btn-default search">
                            ${ tableComponent.searchButtonIcon ? tableComponent.searchButtonIcon : "<span class='glyphicon glyphicon-search' aria-hidden='true'></span>"}
                        </button>
                      </span>
                    </div>
                    `);
            let filterButton = tableFilter.find('button.main');
            let filterElement = tableFilter.find('a');
            let filterInput = tableFilter.find('input');
            let filterSearchButton = tableFilter.find('button.search');
            filterElement.on('click', function () {
                let value = $(this).attr('value');
                filterButton.html(value);
                filterSearchButton.off('click');

                dataTable.columns().every(function () {
                    let column = this;
                    column.search('');
                    let header = column.header();
                    // eslint-disable-next-line no-undef
                    let title = $(header).html();
                    if (title === filterButton.html()) {
                        filterSearchButton.on('click', function () {
                            let val = filterInput.val();
                            column.search(val).draw();
                        });
                    }
                });
            });
        });
    }

    function setTableRefreshButton(tableComponent, tableDomElement){
        tableDomElement.parent().find('div.refreshTable').each(function () {
            let refreshTable = $(this);
            refreshTable.html(`
                    <div class="input-group">
                        <button type="button" class="btn btn-default">
                            ${ tableComponent.refreshButtonIcon ? tableComponent.refreshButtonIcon : "<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>"}
                        </button>
                    </div>
                    `);
            let refreshTableButton = refreshTable.find('button');
            refreshTableButton.on('click', function () {
                tableComponent.refresh();
            });
        });
    }

    function processClickOnActionElement (actionElement, dataTable, columnComponents) {
        let tr = actionElement.parents("tr");
        let model = dataTable.row(tr).data();
        let actionId = actionElement.attr("action-id");
        if (actionId) {
            let actionIdArray = actionId.split('_');
            let action = columnComponents[+actionIdArray[0]].actions[+actionIdArray[1]];
            if (action.confirmMessage) {
                if (confirm(action.confirmMessage)) {
                    action.onAction(model.id);
                }
            } else {
                action.onAction(model.id);
            }
        }
    }

    function getAllAsyncElementsData (tableElement, dataTable, columnComponents) {
        let asyncElements = [];
        tableElement.find('[async-content-id]').each(function () {
            let contentElement = $(this);
            let tr = contentElement.parents("tr");
            let model = dataTable.row(tr).data();
            let contentId = contentElement.attr("async-content-id");
            if (contentId) {
                let contentIdArray = contentId.split('_');
                let asyncComponent = columnComponents[+contentIdArray[0]].asyncContents[+contentIdArray[1]];
                asyncElements.push({
                    contentId: contentId,
                    modelId: model.id,
                    contentElement: contentElement,
                    asyncComponent: asyncComponent,
                    columnNo: +contentIdArray[0],
                    controlNo: +contentIdArray[1]
                });
            }
        });
        return asyncElements;
    }

    function isContentEmpty (content) {
        const trimmedContent = content.replace(/&nbsp;|\s/g, "").trim();
        return !trimmedContent;
    }

    function fillAsyncElementsContent (promisesArray) {
        Promise.all(promisesArray).then(values => {
            let allContentIsEmpty = true;
            values.forEach(value => {
                if (value.element)
                    {
                        allContentIsEmpty &= isContentEmpty(value.content);
                    }
            });
            values.forEach(value => {
                if (value.element)
                    {
                        if (allContentIsEmpty) {
                            value.element.contentElement.html('');
                        } else {
                            value.element.contentElement.html(value.content);
                        }
                    }
            })
        }, reason => {
            if (reason.element) {
                reason.element.contentElement.html(reason.content);
            }
        });
    }
</script>
<style>
    /*noinspection CssUnusedSymbol*/
    .row.no-gutters {
        margin-right: 0;
        margin-left: 0;
    }
    .row.no-gutters > [class*="col-"] {
        padding-right: 0;
        padding-left: 0;
    }
    tbody>tr.selected, .table-striped>tbody>tr:nth-of-type(odd).selected{
        background-color: #aab7d1;
    }
</style>