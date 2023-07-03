import { renderTable } from './MaterialUiTable';
import controllerDefinition from './style-panel-controller.6';

mod.controller('stylerController', controllerDefinition);

prism.registerWidget('muiTable', {
    name: 'muiTable',
    family: 'table',
    title: 'Material UI Table',
    iconSmall: '/plugins/MaterialUiTable/widget-24.png',
    sizing: {
        minHeight: 300,
        maxHeight: 1000,
        minWidth: 100,
        maxWidth: 1000
    },
    style: {
        columnHeaderBackgroundColor: '#FFFFFF',
        columnHeaderBorderLeft: 0,
        columnHeaderBorderRight: 0,
        columnHeaderBorderTop: 0,
        columnHeaderBorderBottom: 0,
        tablePaginationBackgroundColor: '#FFFFFF',
        tablePaginationRowsPerPage: 10,
        tableSize: 'medium'
    },
    styleEditorTemplate: '/plugins/MaterialUiTable/style-panel-template.html',
    data: {
        panels: [{
                name: 'Category',
                type: 'visible',
                canDisableItems: 'true',
                jaqlPanelName: "rows",
                metadata: {
                    types: ['dimensions'],
                    maxitems: 20,
                    sortable: true
                }
            },
            {
                name: 'Value',
                type: 'visible',
                canDisableItems: true,
                jaqlPanelName: "measures",
                metadata: {
                    types: ['measures'],
                    maxitems: 10,
                    sortable: true
                },
                allowedColoringTypes: {
                    color: true,
                    condition: true,
                    range: true,
                    title: "Background"
                }
            },
            {
                name: 'filters',
                type: 'filters',
                metadata: {
                    types: ['dimensions','measures'],
                    maxitems: -1
                }
            }
        ],

        canColor: function(widget, panel, item) {
            return panel.name === "Value";
        },

        getMesaureFilteredDimension: function(widget) {

            var p = widget.metadata.panel(0);

            if (p.items.length === 0) {
                return;
            }

            return p.items[0].jaql.dim;
        },

        getMesaureFilteredItem: function(widget) {

            var p = widget.metadata.panel(0);

            if (p.items.length === 0) {
                return;
            }

            return $$.object.clone(p.items[0], true);
        },

        buildQuery: (widget, query) => {

            widget.metadata.panel('Category').items.forEach((item) => {
                query.metadata.push($$.object.clone(item, true));
            });

            widget.metadata.panel('Value').items.forEach((item) => {
                query.metadata.push($$.object.clone(item, true));
            });

            widget.metadata.panel('filters').items.forEach((item) => {
                const itemClone = $$.object.clone(item, true);
                itemClone.panel = 'scope';
                query.metadata.push(itemClone);
            });

            return query;
        },
        populateMetadata: (widget, items) => {
            const breakdown = prism.$jaql.analyze(items);
            widget.metadata.panel('Category').push(breakdown.dimensions);
            widget.metadata.panel('Value').push(breakdown.measures);
            widget.metadata.panel('filters').push(breakdown.filters);
        }
    },
    render: (widget, args) => {

        const widgetElement = $(args.element)[0];
        const widgetObjectID = widget.oid;
        const data = widget.queryResult;
        const responseMetadata = widget.rawQueryResult;

        if (!responseMetadata) return;
        
        function getColumnAlignment(item) {
            if (item.jaql.tableOptions && item.jaql.tableOptions.align) {
                return item.jaql.tableOptions.align;
            }
            else {
                return item.jaql.datatype == 'numeric' || item.jaql.agg ? 'right' : 'left';
            }
        }
        
        function getColumnTitleAlignment(item) {
            if (item.jaql.tableOptions && item.jaql.tableOptions.alignTitle) {
                return item.jaql.tableOptions.alignTitle;
            }
            else if (item.jaql.tableOptions && item.jaql.tableOptions.align) {
                return item.jaql.tableOptions.align;
            }
            else {
                return item.jaql.datatype == 'numeric' || item.jaql.agg ? 'right' : 'left';
            }
        }

        const columns = widget.rawQueryResult.metadata.map((item, index, array) => {
            return {
                id: item.jaql.title,
                label: item.jaql.title,
                datatype: item.jaql.datatype,
                align: getColumnAlignment(item),
                alignTitle: getColumnTitleAlignment(item),
                minWidth: 170
            };
        });

        const rows = widget.queryResult.$$rows.map((row, index, array) => {
            let currRow = {};
            columns.map((col, index) => {
                let metadata = widget.rawQueryResult.metadata[index];
                let key = metadata.jaql.title;
                let useRawData = false;
                if (metadata.format && metadata.format.mask) {
                    if (col.datatype == 'numeric' && (metadata.format.mask.number && metadata.format.mask.number.separated == false) && metadata.format.mask.abbreviations) {
                        let abbrev = metadata.format.mask.abbreviations;
                        useRawData = !abbrev.b && !abbrev.k && !abbrev.m && !abbrev.t ? true : false;
                    }
                }
                currRow[key] = useRawData ? row[index].text : row[index].text;

                if (row[index].color) {
                    key += '-color';
                    currRow[key] = row[index].color;
                }
            });
            return currRow;
        });

        // Clear widget element
        widgetElement.innerHTML = '';

        let container1 = document.createElement('div');
        container1.setAttribute('style', 'padding: 5px');
        widgetElement.appendChild(container1);

        let style = widget.style;
        delete style.narration;

        renderTable(container1, columns, rows, style);

    }
});

prism.on('beforemenu', function(e, args) {

    var menuName = args.settings.name || 'widget';

    if (menuName == 'widget-metadataitem') {
        
        let menuItemAlignColumn = {
            caption: "Align Column",
            disabled: false,
            items: [
                {
                    caption: "Left",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.align && args.settings.item.jaql.tableOptions.align == 'left' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.align = 'left';
                                    e.targetScope.widget.refresh();
                        
                    }
                },
                {
                    caption: "Center",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.align && args.settings.item.jaql.tableOptions.align == 'center' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.align = 'center';
                                    e.targetScope.widget.refresh();
                    }
                },
                {
                    caption: "Right",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.align && args.settings.item.jaql.tableOptions.align == 'right' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.align = 'right';
                                    e.targetScope.widget.refresh();
                    }
                }
            ]
        };
        
        let menuItemAlignColumnTitle = {
            caption: "Align Column Header",
            disabled: false,
            items: [
                {
                    caption: "Left",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.alignTitle && args.settings.item.jaql.tableOptions.alignTitle == 'left' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.alignTitle = 'left';
                                    e.targetScope.widget.refresh();
                    }
                },
                {
                    caption: "Center",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.alignTitle && args.settings.item.jaql.tableOptions.alignTitle == 'center' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.alignTitle = 'center';
                                    e.targetScope.widget.refresh();
                    }
                },
                {
                    caption: "Right",
                    type: "option",
                    checked: args.settings.item.jaql.tableOptions && args.settings.item.jaql.tableOptions.alignTitle && args.settings.item.jaql.tableOptions.alignTitle == 'right' || false,
                    execute: a => {
                                    if (!args.settings.item.jaql.tableOptions) args.settings.item.jaql.tableOptions = {};
                                    args.settings.item.jaql.tableOptions.alignTitle = 'right';
                                    e.targetScope.widget.refresh();
                    }
                }
            ]
        };
        
        let menuItemTableOptions = {
            caption: "Table Options",
            items: [
                menuItemAlignColumn,
                menuItemAlignColumnTitle
            ]
        };
        
        args.settings.items.push(menuItemTableOptions);

    }
});