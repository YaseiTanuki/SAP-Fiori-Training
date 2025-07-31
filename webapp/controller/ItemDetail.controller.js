sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("improve.controller.ItemDetail", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("itemDetail").attachPatternMatched(this._onItemMatched, this);
        },

        _onItemMatched: function (oEvent) {
            var sItemID = oEvent.getParameter("arguments").item_id;
            var sPath = "/ZDF_ITEM('" + sItemID + "')";
            console.log("Binding Object Page to:", sPath);

            this.getView().bindElement({
                path: sPath,
                events: {
                    dataRequested: function () {},
                    dataReceived: function (oEvent) {
                        const data = oEvent.getParameter("data");
                        console.log("Item Detail data received:", data);
                        if (!data) {
                            console.warn("No data found for item_id:", sItemID);
                        }
                    }
                }
            });
        }
    });
});
