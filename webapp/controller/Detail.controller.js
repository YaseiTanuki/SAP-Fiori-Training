sap.ui.define([
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
    "use strict"

    return Controller.extend("improve.controller.Detail", {
        onInit: function () {
            console.log("Detail controller INIT");
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oModel = this.getOwnerComponent().getModel();

            this.oRouter.getRoute("detail").attachPatternMatched(this._onRequestMatch, this)
        },

        _onRequestMatch: function (oEvent) {
            var sRequestID = oEvent.getParameter("arguments").request_id || "0";
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZDF_PR('" + sRequestID + "')";
            console.log("Binding detail with path:", sPath);
            this.getView().bindElement({
                path: sPath,
                events: {
                    dataRequested: function () {
                        // Optional: show busy
                    },
                    dataReceived: function (oEvent) {
                        const data = oEvent.getParameter("data");
                        console.log("Detail data received:", data);
                        if (!oEvent.getParameter("data")) {
                            // No data found, optional: show message
                            console.warn("No data found for request_id:", sRequestID);
                        }
                    }
                }
            });
        }
    })
}

)