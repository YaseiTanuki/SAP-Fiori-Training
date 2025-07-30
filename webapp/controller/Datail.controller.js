sap.ui.define([
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
    "use strict"

    return Controller.extend("improve.controller.Detail", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oModel = this.getOwnerComponent().getModel();

            this.oRouter.getRoute("detail").attachPatternMatched(this._onRequestMatch, this)
        },

        _onRequestMatch: function (oEvent) {
            this._request = oEvent.getParameter("arguments").request_id || this._request || "0";
            this.getView().bindElement({
                path: "/ZDF_PRSet('" + this._request + "')",
                model: ""
            })
        }
    })
}

)