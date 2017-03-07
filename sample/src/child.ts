// Copyright © 2017 DWANGO Co., Ltd.

import * as db from "../../lib";
import * as mdb from "../../node_modules/@cross-border-bridge/multiplex-data-bus";

window.addEventListener("load", () => {
	const dataBus = new db.PostMessageDataBus(window.parent);
	const textArea = <HTMLTextAreaElement>document.getElementById("received");
	const dataBus01 = new mdb.MultiplexDataBus(dataBus, "dataBus01");
	const dataBus02 = new mdb.MultiplexDataBus(dataBus, "dataBus02");
	dataBus01.addHandler((a, b, c) => {
		textArea.value += `[dataBus01] ${a},${b},${c}\n`;
	});
	dataBus02.addHandler((a, b, c) => {
		textArea.value += `[dataBus02] ${a},${b},${c}\nhandler removed.\n`;
		return true;
	});
	document.getElementById("send1").addEventListener("click", () => {
		dataBus01.send(1, 2, 3);
	});
	document.getElementById("send2").addEventListener("click", () => {
		dataBus01.send("foo", "bar");
	});
	document.getElementById("send3").addEventListener("click", () => {
		dataBus02.send(1, 2, 3);
	});
	document.getElementById("destroy").addEventListener("click", () => {
		dataBus01.destroy();
		dataBus02.destroy();
		dataBus.destroy();
	});
});
