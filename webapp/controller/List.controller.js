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

            var oSmartTable = this.byId("RequestTable");
            if (oSmartTable) {
                oSmartTable.attachInitialise(function () {
                    var oInnerTable = oSmartTable.getTable();
                    oInnerTable.attachCellClick(this.onListItemPress, this);
                }.bind(this));
            }

            this.oRouter = this.getOwnerComponent().getRouter();
            this._bDescendingSort = false;
        },

        onListItemPress: function (oEvent) {
            var oTable = oEvent.getSource();
            var iRowIndex = oEvent.getParameter("rowIndex");
            console.log(iRowIndex)
            var oContext = oTable.getContextByIndex(iRowIndex);
            console.log(oContext)
            if (oContext) {
                var sRequestID = oContext.getProperty("request_id");
                console.log("Item ID from cell click:", sRequestID);
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1)
                console.log("Next UI State:", oNextUIState.layout);
                if (sRequestID) {
                    this.oRouter.navTo("detail", {request_id: sRequestID, layout: oNextUIState.layout});
                    console.log("Navigating to detail with:", sRequestID, oNextUIState.layout);
                }
            }

            
            
        },

    });

});