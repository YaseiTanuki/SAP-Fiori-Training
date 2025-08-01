sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (
    JSONModel, Controller, MessageBox
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
            var sPath = "/ZDF_I_PR('" + this.sRequestID + "')";

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

        onEditRequest: function () {
            this._oEditDialog = this._oEditDialog || this.getView().byId("editRequestDialog");

            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("Không có dữ liệu request để sửa.");
                return;
            }

            var oData = oContext.getObject();

            this.getView().byId("creatorInput").setValue(oData.creator || "");
            this.getView().byId("statusInput").setValue(oData.status || "");
            this.getView().byId("totalInput").setValue(oData.total || 0);
            this.getView().byId("currencyInput").setValue(oData.currency_code || "");

            this._createdDate = oData.created_date; // giữ nguyên ngày cũ
            this._oEditDialog.open();
        },

        onCancelEditRequest: function () {
            if (this._oEditDialog) {
                this._oEditDialog.close();
            }
        },

        onSaveEditRequest: function () {
            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel();
            var oContext = oView.getBindingContext();

            if (!oContext) {
                MessageBox.error("Không có dữ liệu request để lưu.");
                return;
            }

            var sRequestPath = oContext.getPath();

            var sRequestID = this.sRequestID;
            var sCreator = oView.byId("creatorInput").getValue();
            var sStatus = oView.byId("statusInput").getValue();
            var fTotal = parseFloat(oView.byId("totalInput").getValue());
            var sCurrency = oView.byId("currencyInput").getValue();

            if (!sCreator || !sStatus || isNaN(fTotal) || !sCurrency) {
                MessageBox.error("Vui lòng nhập đầy đủ thông tin hợp lệ.");
                return;
            }

            var oPayload = {
                request_id: sRequestID,
                creator: sCreator,
                created_date: this._createdDate, // giữ nguyên format kiểu /Date(...)/ như ban đầu
                status: sStatus,
                total: fTotal.toString(), // gửi total dạng string
                currency_code: sCurrency
            };

            oModel.update(sRequestPath, oPayload, {
                success: function () {
                    MessageBox.success("Cập nhật Request thành công.");
                    this.getView().getElementBinding().refresh(true);
                    this._oEditDialog.close();
                }.bind(this),
                error: function () {
                    MessageBox.error("Cập nhật Request thất bại.");
                }
            });
        },

        onDeleteRequest: function () {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            var oContext = this.getView().getBindingContext();
            if (!oContext) {
                MessageBox.error("No request selected.");
                return;
            }
        
            var sPath = oContext.getPath(); // path từ binding context, ví dụ: "/ZDF_I_PR('REQ000123')"
        
            MessageBox.confirm("Are you sure you want to delete this request?", {
                title: "Confirm Deletion",
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        oModel.remove(sPath, {
                            success: function () {
                                MessageBox.success("Request deleted successfully.");
                                // Navigate back to list view (OneColumn layout)
                                var oRouter = that.getOwnerComponent().getRouter();
                                var oNextUIState = that.getOwnerComponent().getHelper().getNextUIState(0);
                                oRouter.navTo("list", { layout: oNextUIState.layout });
                            },
                            error: function () {
                                MessageBox.error("Deletion failed.");
                            }
                        });
                    }
                }
            });
        }
        
    });
});
