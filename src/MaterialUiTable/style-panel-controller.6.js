// AngularJS controller for the style panel
const controller = ['$scope', ($scope) => {
    // Watch for style property changes to redraw the widget
    $scope.$watch('widget.style.tableSize', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.tablePaginationBackgroundColor', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.tablePaginationRowsPerPage', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.columnHeaderBackgroundColor', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.columnHeaderBorderLeft', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.columnHeaderBorderRight', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.columnHeaderBorderTop', () => {
        $scope.$root.widget.redraw();
    });
    $scope.$watch('widget.style.columnHeaderBorderBottom', () => {
        $scope.$root.widget.redraw();
    });
}];

module.exports = controller;
