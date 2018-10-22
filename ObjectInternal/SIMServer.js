SIMServer.initCreate = function() {
	this.getField("simSrvUsername").setVisibility(ObjectField.VIS_FORM);
	this.getField("simSrvClientCertificate").setVisibility(ObjectField.VIS_FORM);
};

SIMServer.initCopy = function() {
	SIMServer.initCreate.call(this);
};

SIMServer.initUpdate = function() {
	var user = this.getField("simSrvUsername");
	var cert = this.getField("simSrvClientCertificate");
	var pwd = this.getField("simSrvPassword");
	user.setVisibility(cert.isEmpty() || pwd.isEmpty() ? ObjectField.VIS_FORM : ObjectField.VIS_NOT);
	cert.setVisibility(user.isEmpty() || pwd.isEmpty() ? ObjectField.VIS_FORM : ObjectField.VIS_NOT);
};

SIMServer._simRefreshAll = function() {
	try {
		console.log("Refreshing all instances for server: " +  this.getFieldValue("simSrvName"));
		var url = this.getFieldValue("simSrvURL") + "/api?action=list";
		var user = this.getFieldValue("simSrvUsername");
		var cert = this.getField("simSrvClientCertificate");
		var pwd = this.getFieldValue("simSrvPassword");
		var json;
		if (!cert.isEmpty()) {
			var c = cert.getDocument(this.getGrant());
			console.log("Calling " + url + " with client certificate " + c.getName());
			json = Tool.readUrlWithClientCert(url, c.getBytes(true), pwd);
		} else {
			console.log("Calling " + url + " with username " + user);
			json = Tool.readUrl(url, user, pwd);
		}
		var res = new JSONObject(json);
		var rows = res.getJSONArray("list");
		console.log(rows.length() + " sandboxes found");
		var ins = this.getGrant().getTmpObject("SIMInstance");
		var inss = [];
		var inst = new BusinessObjectTool(ins);
		for (var i = 0; i < rows.length(); i++) {
			var row = rows.get(i);
			var name = row.getString("name");
			console.log("Processing " + name + " sandbox");
			var id = this.getGrant().simpleQuery("select row_id from " + ins.getTable() + " where ins_srv_id = " + this.getRowId() + " and ins_name = '" + name + "'");
			if (Tool.isEmpty(id)) {
				ins.resetValues(true);
				ins.setFieldValue("simInsSrvId", this.getRowId());
				ins.setFieldValue("simInsName", name);
				ins.setFieldValue("simInsDescription", "Source = " + row.getString("source"));
			} else {
				ins.select(id);
			}
			ins.setFieldValue("simInsOwner", row.optString("owner_email", ""));
			ins.setFieldValue("simInsCreated", row.getString("created"));
			ins.setFieldValue("simInsUpdated", row.optString("updated", ""));
			ins.setFieldValue("simInsStatus", row.optString("status", ""));
			ins.setFieldValue("simInsProtected", row.optString("protected", "") == "yes");
			ins.setFieldValue("simInsAutoUpdate", row.optString("auto_update", "") == "yes");
			ins.setFieldValue("simInsAutoSave", row.optString("auto_save", "") == "yes");
			ins.setFieldValue("simInsVersion", row.getString("version").replace(".", "_"));
			var u = row.optString("custom_url", "");
			if (u == "") u = row.optString("url", "");
			ins.setFieldValue("simInsURL", u);
			ins.setFieldValue("simInsEmail", row.optString("email", ""));
			ins.setFieldValue("simInsFirstname", row.optString("firstname", ""));
			ins.setFieldValue("simInsLastname", row.optString("lastname", ""));
			ins.setFieldValue("simInsPhone", row.optString("phone", ""));
			ins.setFieldValue("simInsCompany", row.optString("company", ""));
			inst.validateAndSave();
			inss[ins.getRowId()] = name;
		}
		ins.resetFilters();
		ins.getField("simInsSrvId").setFilter(this.getRowId());
		if (rows.length() < ins.count()) {
			// Remove non existing sandboxes
			var rs = ins.search(false);
			for (var k = 0; k < rs.size(); k++) {
				var r = rs.get(k);
				if (!inss[r[0]]) {
					ins.setValues(r);
					inst.del();
				}
			}
		}
		return Message.formatSimpleInfo("SIM_REFRESHED_ALL");
	} catch (e) {
		var err = e.javaException ? e.javaException.getMessage() : e;
		console.error(err);
		return Message.formatSimpleError(err);
	}
};

// Action
SIMServer.simRefreshAll = function() {
	var ids = this.getSelectedIds();
	var i;
	if (Tool.isEmpty(ids)) {
		this.resetFilters();
		var rows = this.search();
		for (i = 0; i < rows.size(); i++) {
			this.setValues(rows.get(i));
			SIMServer._simRefreshAll.call(this);
		}
	} else {
		for (i = 0; i < ids.size(); i++) {
			this.select(ids.get(i));
			SIMServer._simRefreshAll.call(this);
		}
	}
	return Message.formatSimpleInfo("SIM_REFRESHED_ALL");
};