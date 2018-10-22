SIMInstance.initCreate = function() {
	this.getField("simInsSrvId").setUpdatable(true);
	this.getField("simInsName").setUpdatable(true);
	this.getField("simInsVersion").setUpdatable(true);
};

SIMInstance.initUpdate = function() {
	this.getField("simInsSrvId").setUpdatable(false);
	this.getField("simInsName").setUpdatable(false);
	this.getField("simInsVersion").setUpdatable(false);
};

SIMInstance.callAPI = function(action, param) {
	var name = this.getFieldValue("simInsName");
	var url = this.getFieldValue("simInsSrvId.simSrvURL") + "/api?name=" + name + (action ? "&action=" + action: "") + (param ? "&param=" + HTTPTool.encode(param) : "");
	var user = this.getFieldValue("simInsSrvId.simSrvUsername");
	var cert = this.getField("simInsSrvId.simSrvClientCertificate");
	var pwd = this.getFieldValue("simInsSrvId.simSrvPassword");
	var json;
	var logact = " for action " + action + " on " + name + (param ? " with parameter " + param : "");
	if (!cert.isEmpty()) {
		var c = cert.getDocument();
		console.log("Calling " + url + " with client certificate " + c.getName() + logact);
		json = Tool.readUrlWithClientCert(url, c.getBytes(true), pwd);
	} else {
		console.log("Calling " + url + " with username " + user + logact);
		json = Tool.readUrl(url, user, pwd);
	}
	return new JSONObject(json);
};

SIMInstance._error = function(status, msg) {
	if (!msg) msg = "";
	return Message.formatSimpleError("Status = " + status + "\n\n" + msg.replace("#", "_"));
};

SIMInstance._info = function(msg) {
	if (!msg) msg = "";
	return Message.formatSimpleInfo(msg.replace("#", "_"));
};

SIMInstance._text = function(msg) {
	if (!msg) msg = "";
	return Message.formatSimpleText("<div class=\"mono\" style=\"max-height: 300px; overflow: auto;\">" + msg.replace("#", "_") + "</div>");
};

SIMInstance.postValidate = function() {
	var n = this.getField("simInsName");
	if (n.isEmpty()) n.setValue(Tool.randomString(10).toLowerCase());
};

SIMInstance.preCreate = function() {
	if (!this.isTmpInstance()) {
		var res = SIMInstance.callAPI.call(this, "add", this.getFieldValue("simInsVersion").replace("_", "."));
		var status = res.optInt("status", 999);
		console.log("Add status = " + status);
		var msg = res.optString("message", "No message");
		if (status == 0) {
			var r = SIMInstance.simGet.call(this);
			if (r.status != 0)
				return SIMInstance._error.call(this, r.status, r.message);
		} else {
			return SIMInstance._error.call(this, status, msg);
		}
	}
};

SIMInstance.isDeleteEnable = function(row) {
	return !this.getField("simInsProtected").getBoolean(true);
};

SIMInstance.preDelete = function() {
	if (!this.isTmpInstance() && !this.getField("simInsProtected").getBoolean(true)) {
		var res = SIMInstance.callAPI.call(this, "del");
		var status = res.optInt("status", 999);
		console.log("Del status = " + status);
		var msg = res.optString("message", "");
		if (status != 0)
			return SIMInstance._error.call(this, status, msg);
	}
};

SIMInstance.isActionEnable = function(row, action) {
	var status = this.getFieldValue("simInsStatus");
	if (action == "sim10Start") return status=="stopped";
	if (action == "sim11Stop" || action == "sim02Health"
		|| action == "sim02Health" || action == "sim03Logs"
		|| action == "sim04IOCredentials" || action == "sim20Upgrade") return status=="started";
	return true;
};

SIMInstance.simGet = function() {
	var res = SIMInstance.callAPI.call(this, "get");
	var status = res.optInt("status", 999);
	var msg = res.optString("message", "");
	if (status == 0) {
		var item = res.optJSONObject("item");
		if (item) {
			this.setFieldValue("simInsOwner", item.optString("owner_email", ""));
			this.setFieldValue("simInsCreated", item.getString("created"));
			this.setFieldValue("simInsUpdated", item.optString("updated", ""));
			this.setFieldValue("simInsStatus", item.optString("status", ""));
			this.setFieldValue("simInsProtected", item.optString("protected", "") == "yes");
			this.setFieldValue("simInsVersion", item.getString("version").replace(".", "_"));
			var url = item.optString("custom_url", null);
			this.setFieldValue("simInsURL", !url ? item.optString("url", "") : url);
			this.setFieldValue("simInsEmail", item.optString("email", ""));
			this.setFieldValue("simInsFirstname", item.optString("firstname", ""));
			this.setFieldValue("simInsLastname", item.optString("lastname", ""));
			this.setFieldValue("simInsPhone", item.optString("phone", ""));
			this.setFieldValue("simInsCompany", item.optString("company", ""));
		} else {
			msg = "No item in get response\n\n" + msg;
		}
	}
	return { status: status, message: msg };
}

SIMInstance.simRefresh = function() {
	try {
		var r = SIMInstance.simGet.call(this);
		console.log("Refresh status = " + r.status);
		if (r.status == 0) {
			new BusinessObjectTool(this).validateAndSave();
			return SIMInstance._info.call(this, "SIM_REFRESHED");
		} else {
			return SIMInstance._error.call(this, r.status, r.message);
		}
	} catch (e) {
		return SIMInstance._error.call(this, 999, e.javaException ? e.javaException.getMessage() : e);
	}
};

SIMInstance.simUpgrade = function() {
	var res = SIMInstance.callAPI.call(this, "upgrade", this.getFieldValue("simInsVersion").replace("_", "."));
	var status = res.optInt("status", 999);
	console.log("Upgrade status = " + status);
	var msg = res.optString("message", "No message");
	if (status == 0) {
		var r = SIMInstance.simGet.call(this);
		console.log("Post ugrade get status = " + r.status);
		if (r.status != 0)
			return SIMInstance._error.call(this, r.status, r.message);
		this.save();
		return SIMInstance._info.call(this, msg);
	} else {
		return SIMInstance._error.call(this, status, msg);
	}
};

SIMInstance.simStart = function() {
	var res = SIMInstance.callAPI.call(this, "start");
	var status = res.optInt("status", 999);
	console.log("Start status = " + status);
	var msg = res.optString("message", "No message");
	if (status == 0) {
		var r = SIMInstance.simGet.call(this);
		console.log("Post start get status = " + r.status);
		if (r.status != 0)
			return SIMInstance._error.call(this, r.status, r.message);
		this.save();
		return SIMInstance._info.call(this, msg);
	} else {
		return SIMInstance._error.call(this, status, msg);
	}
};

SIMInstance.simStop = function() {
	var res = SIMInstance.callAPI.call(this, "stop");
	var status = res.optInt("status", 999);
	console.log("Stop status = " + status);
	var msg = res.optString("message", "No message");
	if (status == 0) {
		var r = SIMInstance.simGet.call(this);
		console.log("Post stop get status = " + r.status);
		if (r.status != 0)
			return SIMInstance._error.call(this, r.status, r.message);
		this.save();
		return SIMInstance._info.call(this, msg);
	} else {
		return SIMInstance._error.call(this, status, msg);
	}
};

SIMInstance.simHealth = function() {
	var res = SIMInstance.callAPI.call(this, "health");
	var status = res.optInt("status", 999);
	console.log("Check status = " + status);
	var msg = res.optString("message", "No message");
	if (status != 0)
		return SIMInstance._error.call(this, status, msg);
	return SIMInstance._text.call(this, new JSONObject(msg).toString(4));
};

SIMInstance.simLogs = function() {
	var res = SIMInstance.callAPI.call(this, "logs");
	var status = res.optInt("status", 999);
	console.log("Get logs status = " + status);
	var msg = res.optString("message", "No message");
	if (status != 0)
		return SIMInstance._error.call(this, status, msg);
	return SIMInstance._text.call(this, msg);
};

SIMInstance.simIOCredentials = function() {
	var res = SIMInstance.callAPI.call(this, "iocredentials");
	var status = res.optInt("status", 999);
	console.log("Get I/O credentials status = " + status);
	var msg = "I/O URL: " + res.optString("io_url", "empty")
		+ "\nI/O user: " + res.optString("io_user", "empty")
		+ "\nI/O password: " + res.optString("io_password", "empty");
	if (status != 0)
		return SIMInstance._error.call(this, status, msg);
	return SIMInstance._text.call(this, msg);
};

SIMInstance.simHistory = function() {
	var res = SIMInstance.callAPI.call(this, "history");
	var status = res.optInt("status", 999);
	console.log("History status = " + status);
	var msg = res.optString("message", "No message");
	if (status != 0)
		return SIMInstance._error.call(this, status, msg);
	return SIMInstance._text.call(this, msg);
};