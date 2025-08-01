sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text",
    "sap/m/Input",
    "sap/ui/layout/form/SimpleForm",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    JSONModel, Controller, MessageBox, Dialog, Button, Text, Input,
    SimpleForm, Filter, FilterOperator
) {
    "use strict";

    return Controller.extend("improve.controller.Detail", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oModel = this.getOwnerComponent().getModel();

            this.oRouter.getRoute("detail").attachPatternMatched(this._onRequestMatch, this);

            var oSmartTable = this.byId("itemTable");
            oSmartTable.attachInitialise(function () {
                var oInnerTable = oSmartTable.getTable();
                if (oInnerTable && oInnerTable.attachCellClick) {
                    oInnerTable.attachCellClick(this.onItemPress, this);
                }
            }.bind(this));
        },

        _onRequestMatch: function (oEvent) {
            this.sRequestID = oEvent.getParameter("arguments").request_id || "0";
            var sPath = "/ZDF_PR('" + this.sRequestID + "')";

            this.getView().bindElement({
                path: sPath,
                events: {
                    dataReceived: function (oEvent) {
                        const data = oEvent.getParameter("data");
                        if (!data) {
                            MessageBox.warning("No data found for request_id: " + this.sRequestID);
                        }
                    }.bind(this)
                }
            });

            var oFilterBar = this.byId("itemFilterBar");
            if (oFilterBar) {
                oFilterBar.setFilterData({ request_id: this.sRequestID });
                oFilterBar.search();
            }
        },

        onItemPress: function (oEvent) {
            var oTable = oEvent.getSource();
            var iRowIndex = oEvent.getParameter("rowIndex");
            var oContext = oTable.getContextByIndex(iRowIndex);

            if (oContext) {
                var sItemID = oContext.getProperty("item_id");
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2);
                this.oRouter.navTo("itemDetail", {
                    item_id: sItemID,
                    request_id: this.sRequestID,
                    layout: oNextUIState.layout
                });
            }
        },

    });
});
