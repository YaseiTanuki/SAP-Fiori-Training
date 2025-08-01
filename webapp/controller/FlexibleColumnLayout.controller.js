sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
    "use strict"

    return Controller.extend("improve.controller.FlexibleColumnLayout", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.attachRouteMatched(this.onRouteMatched, this);
            this.oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

            this.oFCLColumnSizes = {
                desktop: {
                    TwoColumnsMidExpanded: "25/75/0"
                }
            };

            this.oFCL = this.getView().byId("fcl");
            var oModel = new JSONModel(this.oFCLColumnSizes)
            this.getView().setModel(oModel, "columnsDistribution");
        },

        onBeforeRouteMatched: function(oEvent) {
            var oLayoutModel = this.getOwnerComponent().getModel("layoutModel");
            var sLayout = oEvent.getParameters().arguments.layout;
            if (!sLayout) {
                var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(0);
                sLayout = oNextUIState.layout;
            }
            
            if (sLayout)
                oLayoutModel.setProperty("/layout", sLayout);
                console.log("Set layout to:", sLayout);
        },
        
        onRouteMatched: function (oEvent) {
            var sRouteName = oEvent.getParameter("request_id"),
            oArguments = oEvent.getParameter("arguments");
            this._updateUIElements();
            this.currentRouteName = sRouteName;
            this.currentItem = oArguments.item_id
        },

        onStateChanged: function (oEvent) {
            var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
                sLayout = oEvent.getParameter("layout");
            this._updateUIElements();
            console.log("Layout now:", sLayout);

            if(bIsNavigationArrow) {
                this.oRouter.navTo(this.currentRouteName, {item_id: this.currentItem, layout: sLayout}, true)
            }
        },

        _updateUIElements: function () {
            var oLayoutModel = this.getOwnerComponent().getModel("layoutModel");
            var oUIState = this.getOwnerComponent().getHelper().getCurrentUIState();
            oLayoutModel.setData(oUIState);
        },

        onExit: function () {
            this.oRouter.detachRouteMatched(this.onRouteMatched, this);
            this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this)
        },

        onColumnsDistributionChange: function (oEvent) {
			var sMedia = oEvent.getParameter("media"),
				sLayout = oEvent.getParameter("layout"),
				sColumnsSizes = oEvent.getParameter("columnsSizes"),
				oModel =  this.getView().getModel("columnsDistribution"),
				sPath = `/${sMedia}/${sLayout}`;

				oModel.setProperty(sPath, sColumnsSizes);
		},

    })
}

)