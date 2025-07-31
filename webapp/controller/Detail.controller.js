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
                    layout: oNextUIState.layout
                });
            }
        },

        onAddItem: function () {
            var oDialog = sap.ui.getCore().byId("addItemDialog");
            if (!oDialog) {
                oDialog = new Dialog({
                    id: "addItemDialog",
                    title: "Thêm Item",
                    content: new SimpleForm({
                        content: [
                            new Text({ text: "Item ID" }),
                            new Input("addItemID"),
                            new Text({ text: "Tên Item" }),
                            new Input("addItemName"),
                            new Text({ text: "Số lượng" }),
                            new Input("addQuantity"),
                            new Text({ text: "Tổng tiền" }),
                            new Input("addTotalPrice"),
                            new Text({ text: "Tiền tệ" }),
                            new Input("addCurrency")
                        ]
                    }),
                    beginButton: new Button({
                        id: "addConfirmBtn",
                        text: "Tạo",
                        press: function () {
                            var sPriceRaw = sap.ui.getCore().byId("addTotalPrice").getValue();
                            var sPrice = parseFloat(sPriceRaw).toFixed(2);

                            var itemData = {
                                item_id: sap.ui.getCore().byId("addItemID").getValue(),
                                request_id: this.sRequestID,
                                item_name: sap.ui.getCore().byId("addItemName").getValue(),
                                quantity: parseInt(sap.ui.getCore().byId("addQuantity").getValue(), 10),
                                total_price: sPrice,
                                currency_code: sap.ui.getCore().byId("addCurrency").getValue()
                            };

                            console.log("Creating item:", itemData);

                            this.oModel.create("/ZDF_ITEM", itemData, {
                                success: function () {
                                    MessageBox.success("Tạo item thành công");
                                    oDialog.close();
                                    this.byId("itemFilterBar").search();
                                }.bind(this),
                                error: function (oError) {
                                    MessageBox.error("Lỗi tạo item: " + oError.message);
                                }
                            });
                        }.bind(this)
                    }),
                    endButton: new Button({
                        id: "addCancelBtn",
                        text: "Hủy",
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });
            }
            oDialog.open();
        },

        onEditItem: function () {
            var oTable = this.byId("itemTable").getTable();
            var oContext = oTable.getContextByIndex(oTable.getSelectedIndex());

            if (!oContext) {
                MessageBox.warning("Chọn một item để sửa");
                return;
            }

            var oData = oContext.getObject();

            var oDialog = new Dialog({
                id: "editItemDialog",
                title: "Sửa Item",
                content: new SimpleForm({
                    content: [
                        new Text({ text: "Tên Item" }),
                        new Input("editItemName", { value: oData.item_name }),
                        new Text({ text: "Số lượng" }),
                        new Input("editQuantity", { value: oData.quantity }),
                        new Text({ text: "Tổng tiền" }),
                        new Input("editTotalPrice", { value: oData.total_price }),
                        new Text({ text: "Tiền tệ" }),
                        new Input("editCurrency", { value: oData.currency_code })
                    ]
                }),
                beginButton: new Button({
                    id: "editConfirmBtn",
                    text: "Lưu",
                    press: function () {
                        var sPriceRaw = sap.ui.getCore().byId("editTotalPrice").getValue();
                        var sPrice = parseFloat(sPriceRaw).toFixed(2);

                        var updatedData = {
                            item_name: sap.ui.getCore().byId("editItemName").getValue(),
                            quantity: parseInt(sap.ui.getCore().byId("editQuantity").getValue(), 10),
                            total_price: sPrice,
                            currency_code: sap.ui.getCore().byId("editCurrency").getValue()
                        };

                        this.oModel.update(oContext.getPath(), updatedData, {
                            success: function () {
                                MessageBox.success("Sửa thành công");
                                oDialog.close();
                                this.byId("itemFilterBar").search();
                            }.bind(this),
                            error: function (oError) {
                                MessageBox.error("Lỗi sửa item: " + oError.message);
                            }
                        });
                    }.bind(this)
                }),
                endButton: new Button({
                    id: "editCancelBtn",
                    text: "Hủy",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });
            oDialog.open();
        },

        onDeleteItem: function () {
            var oTable = this.byId("itemTable").getTable();
            var oContext = oTable.getContextByIndex(oTable.getSelectedIndex());

            if (!oContext) {
                MessageBox.warning("Chọn một item để xóa");
                return;
            }

            MessageBox.confirm("Bạn có chắc muốn xóa item này?", {
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        this.oModel.remove(oContext.getPath(), {
                            success: function () {
                                MessageBox.success("Xóa thành công");
                                this.byId("itemFilterBar").search();
                            }.bind(this),
                            error: function (oError) {
                                MessageBox.error("Lỗi xóa item: " + oError.message);
                            }
                        });
                    }
                }.bind(this)
            });
        }
    });
});
