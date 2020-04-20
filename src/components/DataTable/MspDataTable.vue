<!--suppress JSUnusedLocalSymbols -->
<script>
    import MspColumn from './MspColumn'

    const rowSelectorClass = 'row-selector';
    const rowSelectedEvent = 'row-selected';
    const tableRefreshedEvent = 'table-refreshed';
    const actionIdAttribute = 'action-id';
    const asyncContentIdAttribute = 'async-content-id';
    const searchIconDefaultClass = 'glyphicon glyphicon-search';
    const refreshIconDefaultClass = 'glyphicon glyphicon-refresh';
    const tableFilterDivClass = 'tableFilter';
    const refreshTableDivClass = 'refreshTable';
    const tableToolsDivClass = 'tableTools';
    const tableActionsDivClass = 'actions';

    export default {
        name: "MspDataTable",
        props: {
            'dataSourceUrl': {type: String, default: ""},
            'pageLength': String,
            'idDataField': String,
            'notSelectField': String,
            'notSelectValue': String,
            'className': String,
            'serverSide': Boolean,
            'hideTools': Boolean,
            'processingEnable': Boolean,
            'dataSourceMethod': String,
            'refreshButtonIcon': {type: String, default: "<i class='fas fa-sync'></i>"},
            'searchButtonIcon': {type: String, default: "<i class='fas fa-search'></i>"},
            'selectableRows': Boolean,
            'selectedRowIcon': {type: String, default: "<i class='far fa-check-square'>"},
            'unselectedRowIcon': {type: String, default: "<i class='far fa-square'>"},
            'existsSelectedRowsIcon': {type: String, default: "<i class='fas fa-square'></i>"}
        },
        render: function (createElement) {
            return createElement(
                'table',
                {
                    id: this.$attrs["id"],
                    hidden: "hidden",
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
        provide: function () {
            return {
                tableColumns: this.columns
            }
        },
        methods: {
            refresh: function(){
                let tableComponent = this;
                let tableDomElement = getTableDomElement(this);
                let dataTable = tableDomElement.DataTable();
                dataTable.ajax.reload(() => {
                    dataTable.rows('.selected').nodes().to$().removeClass('selected');
                    // eslint-disable-next-line no-undef
                    $(dataTable.table().header()).find("tr").removeClass('selected');
                    // eslint-disable-next-line no-undef
                    dataTable.rows().nodes().each(row => setRowCheckedIcon($(row), this, dataTable));
                    dataTable.processing = false;
                    emitAboutSelectedRows(dataTable, this, tableDomElement);
                    tableComponent.$emit(tableRefreshedEvent);
                });
            },
            addActionElement: function(actionDomElement){
                let tableDomElement = getTableDomElement(this);
                let actionDiv = tableDomElement.parent().find(`div.${tableActionsDivClass}`);
                actionDiv.append(actionDomElement);
            },
            getSelectedItems: function() {
                let tableDomElement = getTableDomElement(this);
                let dataTable = tableDomElement.DataTable();
                return getSelectedRowsItems(dataTable);
            },
            updateTableItems: function(newItems, changeItemPropertiesFunction){
                let tableDomElement = getTableDomElement(this);
                let dataTable = tableDomElement.DataTable();
                let tableComponent = this;
                let rowsForAdd = [];
                newItems.forEach(item => {
                    let tableItem = null;
                    dataTable.rows().every(function(){
                        let row = this;
                        if (row.data() && row.id() === item[tableComponent.idDataField]){
                            tableItem = row.data();
                            changeItemPropertiesFunction(item, tableItem);
                            row.invalidate();
                        }
                    });
                    if (!tableItem){
                        rowsForAdd.push(item);
                    }
                });
                dataTable.rows().eq(0).each(function(idx){
                    let row = dataTable.row(idx);
                    let removeNeed = true;
                    newItems.forEach(item => {
                        if (row.data() && row.id() === item[tableComponent.idDataField]){
                            removeNeed = false;
                        }
                    });
                    if (removeNeed){
                        // eslint-disable-next-line no-undef
                        $(row.node()).addClass("for-remove");
                    }
                });
                dataTable.rows('.for-remove').remove();
                rowsForAdd.forEach(row => dataTable.row.add(row));
                dataTable.draw(false);
            },
            startRefreshSpin: function(){
                let tableDomElement = getTableDomElement(this);
                tableDomElement.parent().find(`div.${refreshTableDivClass}`).find("button > i").addClass(" fa-spin")
            },
            stopRefreshSpin: function(){
                let tableDomElement = getTableDomElement(this);
                tableDomElement.parent().find(`div.${refreshTableDivClass}`).find("button > i").removeClass(" fa-spin")
            }
        },
        mounted: function () {
            let dataTableConfig = prepareDataTableOptions(this.columns, this);
            let tableDomElement = getTableDomElement(this);
            tableDomElement.addClass(this.className);
            // noinspection SpellCheckingInspection
            let isServerSide = this.serverSide;
            let method = this.dataSourceMethod ? this.dataSourceMethod : "GET";
            let dataTable = tableDomElement.DataTable({
                "processing": this.processingEnable,
                "rowId": this.idDataField,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "pageLength": this.pageLength,
                "language": {
                    "processing": `<i class="fa fa-spinner fa-1x fa-spin"></i>&nbsp;Processing...`,
                    "loadingRecords": `<i class="fa fa-spinner fa-1x fa-spin"></i>&nbsp;Loading...`,
                    "lengthMenu": '_MENU_'
                },
                "serverSide": isServerSide,
                "ajax": {
                    "url": this.dataSourceUrl,
                    "type": isServerSide ? "POST" : method,
                    "dataType": "json"
                },
                "order": this.selectableRows ? [[1, 'asc']] : [[0, 'asc']],
                "columns": dataTableConfig.dtColumns,
                "columnDefs": dataTableConfig.dtColumnDefs,
                "buttons": [{
                    extend: 'colvis',
                    text: 'Column Visibility',
                    titleAttr: 'Col visibility',
                    className: 'btn-outline-default'
                }],
                "dom":
                    `<"row ${tableToolsDivClass}"
                        <"col-sm-12 col-md-6 d-flex align-items-center justify-content-start"<"${tableFilterDivClass}">>
                        <"col-sm-12 col-md-6 d-flex align-items-center justify-content-end"l<"dt-buttons"B><"${refreshTableDivClass}">>
                    >
                    <"${tableActionsDivClass}">
                    rt
                    <"row"
                        <"col-sm-12 col-md-6"i>
                        <"col-sm-12 col-md-6"p>
                    >`
            });
            tableDomElement.show();
            tableDomElement.find('.has-tooltip').tooltip();

            let columnComponents = this.columns;
            createTableFilter(this, columnComponents, tableDomElement, dataTable);
            createTableRefreshButton(dataTable, this, tableDomElement);

            let tableComponent = this;
            initRowSelecting(tableDomElement, dataTable, tableComponent);
            adjustTableToolbarElements(tableDomElement, tableComponent);

            tableDomElement.on('click', `[${actionIdAttribute}]`, function () {
                // eslint-disable-next-line no-undef
                let actionElement = $(this);
                processClickEventOnActionElement(actionElement, dataTable, columnComponents);
            });

            dataTable.on('draw', function () {
                updateSelectIconInHeader(tableDomElement, dataTable, tableComponent);
                createAsyncElements(tableDomElement, dataTable, columnComponents);
            });
        }
    };

    function adjustTableToolbarElements(tableDomElement, tableComponent) {
        tableDomElement.parent().find('div.inlineBlock')
            .css("padding-left", "10px");
        tableDomElement.parent().find(`div.${tableActionsDivClass}`)
            .css("display", "inline-block")
            .css("padding", "10px 0 5px 0");
        if (tableComponent.hideTools) {
            tableDomElement.parent().find(`div.${tableToolsDivClass}`).hide()
        }
        tableDomElement.parent().find(`div.${refreshTableDivClass}`)
            .css("display", "inline-block")
            .css("padding-left", "0");
    }

    function addRowsSelectionColumn(tableComponent, columnNumber, dataTableConfig) {
        if (tableComponent.selectableRows) {
            let dtColumnDef = {
                "targets": columnNumber,
                "width": "30px",
                "title": `<span class="${rowSelectorClass}">${tableComponent.unselectedRowIcon}</i></span>`,
                "className": "text-center",
                "orderable": false,
                // eslint-disable-next-line no-unused-vars
                "render": function (data, type, model) {
                    return tableComponent.notSelectField && tableComponent.notSelectValue && (''+data[tableComponent.notSelectField] === tableComponent.notSelectValue)
                        ? ''
                        : `<span class="${rowSelectorClass}">${tableComponent.unselectedRowIcon}</i></span>`;
                }
            };
            dataTableConfig.dtColumns.push({data: null});
            dataTableConfig.dtColumnDefs.push(dtColumnDef);
            columnNumber++;
        }
        return columnNumber;
    }

    function setRowCheckedIcon(row, tableComponent, dataTable) {
        if (!tableComponent.selectableRows) return;
        let data = dataTable.row(row).data();
        let td = row.children('td').first();
        if (row.hasClass('selected')) {
            td.html(tableComponent.notSelectField && tableComponent.notSelectValue && (''+data[tableComponent.notSelectField] === tableComponent.notSelectValue)
                ? ''
                : `<span class="${rowSelectorClass}">${tableComponent.selectedRowIcon}</i></span>`);
        } else {
            td.html(tableComponent.notSelectField && tableComponent.notSelectValue && (''+data[tableComponent.notSelectField] === tableComponent.notSelectValue)
                ? ''
                : `<span class="${rowSelectorClass}">${tableComponent.unselectedRowIcon}</i></span>`);
        }
    }

    function updateSelectIconInHeader(tableDomElement, dataTable, tableComponent) {
        if (!tableComponent.selectableRows) return;
        let selectedRowsLength = dataTable.rows('.selected').nodes().length;
        let hr = tableDomElement.find('thead>tr').first();
        let th = hr.find('th').first();
        if (selectedRowsLength === dataTable.rows().nodes().length) {
            th.html(`<span class="${rowSelectorClass}">${tableComponent.selectedRowIcon}</i></span>`);
        } else if (selectedRowsLength > 0) {
            th.html(`<span class="${rowSelectorClass}">${tableComponent.existsSelectedRowsIcon}</i></span>`);
            hr.addClass('selected');
        } else {
            th.html(`<span class="${rowSelectorClass}">${tableComponent.unselectedRowIcon}</i></span>`);
        }
    }

    function emitAboutSelectedRows(dataTable, tableComponent, tableDomElement) {
        let items = getSelectedRowsItems(dataTable);
        tableComponent.$emit(rowSelectedEvent, items);
        updateSelectIconInHeader(tableDomElement, dataTable, tableComponent);
    }

    function getSelectedRowsItems(dataTable){
        return dataTable.rows('.selected').data();
    }

    function initRowSelecting(tableDomElement, dataTable, tableComponent) {
        tableDomElement.find('tbody').on('click', `tr>td>.${rowSelectorClass}`, function () {
            // eslint-disable-next-line no-undef
            let tr = $(this).parent().parent();
            tr.toggleClass('selected');
            // noinspection JSUnresolvedFunction
            setRowCheckedIcon(tr, tableComponent, dataTable);
            emitAboutSelectedRows(dataTable, tableComponent, tableDomElement);
        });
        tableDomElement.find('thead').on('click', `tr>th>.${rowSelectorClass}`, function () {
            // eslint-disable-next-line no-undef
            let row = $(this).parent().parent();
            row.toggleClass('selected');
            // noinspection JSUnresolvedFunction
            let th = row.children('th').first();
            if (row.hasClass('selected')) {
                th.html(`<span class="${rowSelectorClass}">${tableComponent.selectedRowIcon}</i></span>`);
                dataTable.rows().nodes().filter(r => ''+dataTable.row(r).data()[tableComponent.notSelectField] !== tableComponent.notSelectValue)
                    .to$().addClass('selected');
            }
            else {
                th.html(`<span class="${rowSelectorClass}">${tableComponent.unselectedRowIcon}</i></span>`);
                dataTable.rows('.selected').nodes().to$().removeClass('selected');
            }
            // eslint-disable-next-line no-undef
            dataTable.rows().nodes().each(row => setRowCheckedIcon($(row), tableComponent, dataTable));
            emitAboutSelectedRows(dataTable, tableComponent, tableDomElement);
        });
    }

    function getTableDomElement(tableComponent) {
        // eslint-disable-next-line no-undef
        return $(tableComponent.$el);
    }

    function createAsyncElements(tableDomElement, dataTable, columnComponents) {
        let asyncElementsData = getAsyncElementsOptions(tableDomElement, dataTable, columnComponents);
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
            let asyncContent = nextElementData.asyncComponent.getAsyncContent(nextElementData.model, nextElementData);
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
    }

    function transformColumnTemplateToValidJavaScript (templateComponent) {
        if (!templateComponent.$slots.default) {
            return "";
        }
        let templateElements = templateComponent.$slots.default.map(function (vNode) {
            // noinspection JSUnresolvedVariable
            return vNode.text ? vNode.text : vNode.elm.outerHTML;
        });
        let templateText = "<span>" + templateElements.join('').trim() + "</span>";
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

    function setRenderFunctionForDataTableColumn(columnComponent, dtColumnDef, actionTemplatesString, asyncContentTemplatesString) {
        if (columnComponent.template) {
            let templateResult = transformColumnTemplateToValidJavaScript(columnComponent.template);
            // eslint-disable-next-line no-unused-vars
            dtColumnDef.render = function (data, type, model, meta) {
                let templateAfterEval;
                try {
                    // noinspection DynamicallyGeneratedCodeJS
                    templateAfterEval = eval(templateResult);
                } catch (err) {
                    templateAfterEval = `Error in template: ${err.message}`;
                }
                return templateAfterEval + asyncContentTemplatesString + actionTemplatesString;
            };
        } else if (columnComponent.$props.modelProperty && (actionTemplatesString || asyncContentTemplatesString)) {
            // eslint-disable-next-line no-unused-vars
            dtColumnDef.render = function (data, type, model) {
                return data + asyncContentTemplatesString + actionTemplatesString;
            }
        } else if (actionTemplatesString || asyncContentTemplatesString) {
            // eslint-disable-next-line no-unused-vars
            dtColumnDef.render = function (data, type, model) {
                return asyncContentTemplatesString + actionTemplatesString;
            }
        }
    }

    function prepareDataTableOptions (columnComponents, tableComponent) {
        let dataTableConfig = {
            dtColumns: [],
            dtColumnDefs: []
        };
        let columnNumber = 0;
        columnNumber = addRowsSelectionColumn(tableComponent, columnNumber, dataTableConfig);
        columnComponents.forEach(function (columnComponent) {
            let dtColumnDef = {
                "targets": columnNumber,
                "title": columnComponent.header,
                "orderable": columnComponent.sortable
            };
            if (columnComponent.className) {
                dtColumnDef.className = columnComponent.className;
            }
            let modelProperty = columnComponent.$props.modelProperty;
            dataTableConfig.dtColumns.push({data: modelProperty ? modelProperty : null});

            let asyncContentTemplates = "";
            let asyncContentNumber = 0;
            let activeColumnNumber = tableComponent.selectableRows ? columnNumber - 1 : columnNumber;
            columnComponent.asyncContents.forEach(function (asyncContent) {
                // noinspection HtmlUnknownAttribute
                asyncContentTemplates += `<span ${asyncContentIdAttribute}='${activeColumnNumber}_${asyncContentNumber}'>${asyncContent.spinTemplate}</span>`;
                asyncContentNumber++;
            });

            let actionTemplates = "";
            let actionNumber = 0;
            columnComponent.actions.forEach(function (action) {
                if (action.template) {
                    // eslint-disable-next-line no-undef
                    let html = $.parseHTML(`<span>${action.template}&nbsp;</span>`);
                    // eslint-disable-next-line no-undef
                    let htmlObject = $(html);
                    htmlObject.first().attr(`${actionIdAttribute}`, activeColumnNumber + "_" + actionNumber);
                    htmlObject.css('cursor', 'pointer');
                    actionTemplates += htmlObject.prop('outerHTML');
                    actionNumber++
                }
            });
            setRenderFunctionForDataTableColumn(columnComponent, dtColumnDef, actionTemplates, asyncContentTemplates);

            dataTableConfig.dtColumnDefs.push(dtColumnDef);
            columnNumber++;
        }, this);

        return dataTableConfig;
    }

    function createTableFilter (tableComponent, columnComponents, tableElement, dataTable) {
        let columnsHtmlList = '';
        columnComponents.forEach(function (column) {
            // noinspection HtmlUnknownAttribute
            if (column.header) columnsHtmlList += `<a class="dropdown-item" href="#" value="${column.header}">${column.header}</a>`;
        });
        tableElement.parent().find('div.tableFilter').each(function () {
            // eslint-disable-next-line no-undef
            let tableFilter = $(this);
            tableFilter.html(`
                <div class="input-group">
                    <div class="btn-group">
                        <button class="btn btn-outline-secondary dropdown-toggle main" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Select column...
                        </button>
                        <div class="dropdown-menu">
                            ${columnsHtmlList}
                        </div>
                    </div>
                    <input type="text" class="form-control" aria-label="...">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default search" style="margin-left: 2px;">
                            ${ tableComponent.searchButtonIcon ? tableComponent.searchButtonIcon : `<span class='${searchIconDefaultClass}' aria-hidden='true'></span>`}
                        </button>
                    </span>
                </div>
                `);
            let filterButton = tableFilter.find('button.main');
            let filterElement = tableFilter.find('a');
            let filterInput = tableFilter.find('input');
            let filterSearchButton = tableFilter.find('button.search');
            filterElement.on('click', function () {
                // eslint-disable-next-line no-undef
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

    function createTableRefreshButton(dataTable, tableComponent, tableDomElement){
        tableDomElement.parent().find('div.refreshTable').each(function () {
            // eslint-disable-next-line no-undef
            let refreshTable = $(this);
            refreshTable.html(`
                    <div class="input-group">
                        <button type="button" class="btn btn-default" style="margin-left: 2px;">
                            ${ tableComponent.refreshButtonIcon ? tableComponent.refreshButtonIcon : `<span class='${refreshIconDefaultClass}' aria-hidden='true'></span>`}
                        </button>
                    </div>
                    `);
            let refreshTableButton = refreshTable.find('button');
            refreshTableButton.on('click', function () {
                tableComponent.refresh();
            });
        });
    }

    function processClickEventOnActionElement (actionElement, dataTable, columnComponents) {
        let tr = actionElement.parents("tr");
        let model = dataTable.row(tr).data();
        let actionId = actionElement.attr(`${actionIdAttribute}`);
        if (actionId) {
            let actionIdArray = actionId.split('_');
            let action = columnComponents[+actionIdArray[0]].actions[+actionIdArray[1]];
            if (action.confirmMessage) {
                if (confirm(action.confirmMessage)) {
                    action.onAction(model);
                }
            } else {
                action.onAction(model);
            }
        }
    }

    function getAsyncElementsOptions (tableDomElement, dataTable, columnComponents) {
        let asyncElements = [];
        tableDomElement.find(`[${asyncContentIdAttribute}]`).each(function () {
            // eslint-disable-next-line no-undef
            let contentElement = $(this);
            let tr = contentElement.parents("tr");
            let model = dataTable.row(tr).data();
            let contentId = contentElement.attr(`${asyncContentIdAttribute}`);
            if (contentId) {
                let contentIdArray = contentId.split('_');
                let asyncComponent = columnComponents[+contentIdArray[0]].asyncContents[+contentIdArray[1]];
                asyncElements.push({
                    contentId: contentId,
                    model: model,
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
        if (content.search(/<img.+blank16\./g) >= 0) return true;
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
                            value.element.contentElement.find('.has-tooltip').tooltip();
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
    .dataTables_length > label{
        margin-bottom: 0;
        padding-right: 3px;
    }

    /*noinspection ALL*/
    table.dataTable{
        margin-bottom: 10px !important;
    }

/*
    div.dataTables_processing {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 50px;
        margin-left: -100px;
        margin-top: -26px;
        text-align: center;
        padding: 1em 0;
    }
*/
</style>