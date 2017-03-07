// Copyright © 2017 DWANGO Co., Ltd.

import * as db from "@cross-border-bridge/data-bus";

export class PostMessageDataBus implements db.DataBus {
	_target: Window;
	_handlers: db.DataBusHandler[];

	constructor(target: Window) {
		this._target = target;
		this._handlers = [];
	}

	send(...data: any[]): void {
		if (!this._target) return;
		this._target.postMessage(JSON.stringify(data), "*");
	}

	addHandler(handler: db.DataBusHandler): void {
		if (!this._target) return;
		if (0 === this._handlers.length) register(this);
		this._handlers.push(handler);
	}

	removeHandler(handler: db.DataBusHandler): void {
		if (!this._target) return;
		var i = this._handlers.indexOf(handler);
		if (i < 0) return;
		this._handlers.splice(i, 1);
		if (0 === this._handlers.length) unregister(this);
	}

	removeAllHandlers(): void {
		if (!this._target || 0 === this._handlers.length) return;
		this._handlers = [];
		unregister(this);
	}

	_onMessage(data: any[]): void {
		if (!this._target || 0 === this._handlers.length) return;
		var r: db.DataBusHandler[] = [];
		for (let h of this._handlers) {
			const ret = h.apply(null, data);
			if (ret) r.push(h);
		}
		for (let h of r) this.removeHandler(h);
	}

	destroy(): void {
		if (!this._target) return;
		this.removeAllHandlers();
		this._target = undefined;
	}
}

const targets: Window[] = [];
const dataBusTable: {[targetId: number]: PostMessageDataBus[]} = {};

function register(dataBus: PostMessageDataBus): void {
	if (!Object.keys(dataBusTable).length) {
		window.addEventListener("message", onMessage);
	}
	let targetId = targets.indexOf(dataBus._target);
	if (targetId === -1) {
		targetId = targets.push(dataBus._target) - 1;
	}
	if (!dataBusTable[targetId]) {
		dataBusTable[targetId] = [];
	}
	dataBusTable[targetId].push(dataBus);
}

function unregister(dataBus: PostMessageDataBus): void {
	let targetId = targets.indexOf(dataBus._target);
	if (targetId === -1) {
		return;
	}
	dataBusTable[targetId] = dataBusTable[targetId].filter(b => b !== dataBus);
	if (!dataBusTable[targetId].length) {
		delete dataBusTable[targetId];
		targets[targetId] = null;
	}
	if (!Object.keys(dataBusTable).length) {
		window.removeEventListener("message", onMessage);
	}
}

function onMessage(ev: MessageEvent): void {
	const targetId = targets.indexOf(ev.source);
	if (targetId === -1) {
		return;
	}
	let data: any[] = null;
	try {
		data = JSON.parse(ev.data);
	} catch (e) {
		return;
	}
	dataBusTable[targetId].forEach(dataBus => {
		dataBus._onMessage(data);
	});
}
