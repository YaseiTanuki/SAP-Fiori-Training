/*global QUnit*/

sap.ui.define([
	"improve/controller/Improve.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Improve Controller");

	QUnit.test("I should test the Improve controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
