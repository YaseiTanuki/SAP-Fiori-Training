sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox'
], function(JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox) {
    "use strict"

    return Controller.extend("improve.controller.List", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel();
            console.log(this.oModel)
            if (this.oModel) {
                console.log("OKAY");
            }


            this.oRouter = this.getOwnerComponent().getRouter();
            this._bDescendingSort = false;
        },

        onlistItemPress: function (oEvent) {
            var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                requestPath = oEvent.getSource().getSelectedItem().getBindingContext().getPath(),
                request = requestPath.split("/").slice(-1).pop();
            
            this.oRouter.navTo("detail", {layout: oNextUIState, request_id: request});
        },

    });

});