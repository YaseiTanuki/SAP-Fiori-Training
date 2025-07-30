sap.ui.define([
    "sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/f/library",
	"sap/f/FlexibleColumnLayoutSemanticHelper",
    "sap/ui/model/odata/v2/ODataModel"
], (UIComponent, JSONModel, library, FlexibleColumnLayoutSemanticHelper, ODataModel) => {
    "use strict";

    var LayoutType = library.LayoutType;

    return UIComponent.extend("improve.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var oLayoutModel = new JSONModel({
                layout: LayoutType.OneColumn
            });
            this.setModel(oLayoutModel, "layoutModel");

            // enable routing
            this.getRouter().initialize();
        },

        getHelper: function () {
            var oFCL = this.getRootControl().byId("fcl"),
                oParams = new URLSearchParams(window.location.search),
                oSettings = {
                    defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
                    defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
                    maxColumnsCount: oParams.get("max")
                };

            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        }
    });
});