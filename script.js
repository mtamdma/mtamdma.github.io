idata = ids;
edata = eds;

for (i in edata) {
	edata[i].ID--
};
for (i in idata) {
	idata[i].IID--
};
for (let e in edata) {
	edata[e].INGREDIENTS = [];
	for (let i in idata) {
		if (idata[i].EID1 == edata[e].EFFECT) {
			edata[e].INGREDIENTS.push(idata[i].IID.toString());
			idata[i].EID1 = edata[e].ID
		};
		if (idata[i].EID2 == edata[e].EFFECT) {
			edata[e].INGREDIENTS.push(idata[i].IID.toString());
			idata[i].EID2 = edata[e].ID
		};
		if (idata[i].EID3 == edata[e].EFFECT) {
			edata[e].INGREDIENTS.push(idata[i].IID.toString());
			idata[i].EID3 = edata[e].ID
		};
		if (idata[i].EID4 == edata[e].EFFECT) {
			edata[e].INGREDIENTS.push(idata[i].IID.toString());
			idata[i].EID4 = edata[e].ID
		};
	};
};
edata.sort(function(a, b) {
	if (a.ID > b.ID) {
		return 1;
	}
	if (a.ID < b.ID) {
		return -1;
	} else {
		return 0;
	};
});
idata.sort(function(a, b) {
	if (a.IID > b.IID) {
		return 1;
	}
	if (a.IID < b.IID) {
		return -1;
	} else {
		return 0;
	};
});

function Calculator() {
	let target = document.getElementById("content")
	target.innerHTML =
		'<div id="controls">' +
		'<button class="btn-cc" onclick="Calculate()">ПОИСК</button><button class="btn-cc" onclick="ClearFilter()">СБРОСИТЬ ФИЛЬТР</button>' +
		'</div>' +
		'<div id="calcarea"></div>';
	ListEffects();
};

function Calculate() {
	let effs = $('#efilter').serializeArray();
	if (effs.length != 0) {
		if (effs.length == 1) {
			pots = Pots1(effs[0].value)
		} else {
			pots = tpots;
		}
		pots = pots.sort(function(a, b) {
			if (a[1][0][2] > b[1][0][2]) {
				return 1
			} else {
				return -1
			};
		})
		target = document.getElementById("calcarea");
		target.innerHTML = '<div id="calculated" class="pots"></div>';
		target = document.getElementById("calculated");
		document.getElementById("controls").innerHTML =
			'<div><button class="btn-cc" onclick="Calculator()">ВЕРНУТЬСЯ К ВЫБОРУ ЭФФЕКТОВ</button>' +
			'<div class="potfilters"><input id="ifilter" type="text" placeholder="Фильтр по ингредиенту"></div>'
		for (let pot of pots) { //potion, potname, potefs
			pid = '';
			pname = []
			for (let ingredient of pot[0]) {
				pid += ingredient.toString();
				pname.push(ingredient)
			};
			//console.log(pid);
			target.innerHTML += '<div class="potion"><div class="potname" id="n' + pid + '"></div><div class="potefs" id="e' + pid + '"></div></div>';
			target = document.getElementById("n" + pid);
			for (let i of pname) {
				target.innerHTML += idata[i].NAME + '<br>+<br>';
			};
			target.innerHTML = target.innerHTML.slice(0, -9);
			target = document.getElementById("e" + pid);
			for (e of pot[1]) {
				target.innerHTML += edata[e[0]].EFFECT;
				if (![0, 1].includes(e[1][0])) {
					target.innerHTML += " СИЛ *" + e[1][0]
				};
				if (![0, 1].includes(e[1][1])) {
					target.innerHTML += " ВРМ *" + e[1][1]
				};
				if (![0, 1].includes(e[1][2])) {
					target.innerHTML += " СТМ *" + e[1][2]
				};
				target.innerHTML += "<br>";

			}
			target = document.getElementById("calculated");


		}

	}
	document.getElementById('ifilter').onkeyup = function() {
		if (this.value.toLowerCase().length > 1) {
			for (row of document.getElementsByClassName("potion")) {
				if (!row.children[0].innerHTML.toLowerCase().includes(this.value.toLowerCase())) {
					row.style = "display:none"
				} else {
					row.style = ""
				};
			};
		} else {
			for (row of document.getElementsByClassName("potion")) {
				row.style = ""
			}
		};
	}

}

function Pots1(eid) {
	pots = []
	ipool = edata[eid].INGREDIENTS
	for (i = 0; i < ipool.length - 1; i++) {
		ai = idata[ipool[i]]
		a = [];
		a.push([ai.EID1, [ai.MMOD1, ai.TMOD1, ai.VMOD1]]);
		a.push([ai.EID2, [ai.MMOD2, ai.TMOD2, ai.VMOD2]]);
		a.push([ai.EID3, [ai.MMOD3, ai.TMOD3, ai.VMOD3]]);
		a.push([ai.EID4, [ai.MMOD4, ai.TMOD4, ai.VMOD4]]);
		for (let j = i + 1; j < ipool.length; j++) {
			pot = []
			let bi = idata[ipool[j]];
			b = [];
			b.push([bi.EID1, [bi.MMOD1, bi.TMOD1, bi.VMOD1]]);
			b.push([bi.EID2, [bi.MMOD2, bi.TMOD2, bi.VMOD2]]);
			b.push([bi.EID3, [bi.MMOD3, bi.TMOD3, bi.VMOD3]]);
			b.push([bi.EID4, [bi.MMOD4, bi.TMOD4, bi.VMOD4]]);
			for (efa of a) {
				for (efb of b) {
					if (efa[0] == efb[0]) {
						if (efa[1][2] >= efb[1][2]) {
							pot.push(efa)
						} else {
							pot.push(efb)
						};
					}
				}
			}

			if (pot.length == 1) {
				pots.push([
					[ipool[i], ipool[j]], pot
				]);
			};
		}
	}
	return pots
}

function ClearFilter() {
	for (i = 0; i < edata.length; i++) {
		if (document.getElementsByName(i)[0].checked = true) {
			document.getElementsByName(i)[0].checked = false
		}
	};
	Refilter();
}

function Refilter() {
	for (i = 0; i < edata.length; i++) {
		document.getElementsByName(i)[0].parentElement.style.display = "";
		document.getElementsByName(i)[0].disabled = false
	};
	let effs = $('#efilter').serializeArray();
	if (effs.length == 1) {
		let eid = effs[0].value;
		let epool = []
		for (ing of edata[eid].INGREDIENTS) {
			if (!epool.includes(idata[ing].EID1)) {
				epool.push(idata[ing].EID1)
			};
			if (!epool.includes(idata[ing].EID2)) {
				epool.push(idata[ing].EID2)
			};
			if (!epool.includes(idata[ing].EID3)) {
				epool.push(idata[ing].EID3)
			};
			if (!epool.includes(idata[ing].EID4)) {
				epool.push(idata[ing].EID4)
			};
		};
		for (i = 0; i < edata.length; i++) {
			if (!epool.includes(i)) {
				document.getElementsByName(i)[0].parentElement.style.display = "none"
			}
		};
	};

	if (effs.length == 2) {
		let eids = [];
		for (i of effs) {
			eids.push(parseInt(i.value))
		};
		//console.log(eids)
		i1pool = [];
		for (let i of idata) { //у каких ингредиентов есть оба эффекта?
			let e = [i.EID1, i.EID2, i.EID3, i.EID4];
			if (e.includes(eids[1]) && e.includes(eids[0])) {
				i1pool.push(i.IID)
			}
		};
		i2pool = edata[eids[0]].INGREDIENTS; //ингредиенты для 1 эффекта (ID)
		i3pool = edata[eids[1]].INGREDIENTS; //ингредиенты для 2 эффекта (ID)
		tpots = [];
		for (let i1 of i1pool) {
			ef1 = [
				[idata[i1].EID1, [idata[i1].MMOD1, idata[i1].TMOD1, idata[i1].VMOD1]],
				[idata[i1].EID2, [idata[i1].MMOD2, idata[i1].TMOD2, idata[i1].VMOD2]],
				[idata[i1].EID3, [idata[i1].MMOD3, idata[i1].TMOD3, idata[i1].VMOD3]],
				[idata[i1].EID4, [idata[i1].MMOD4, idata[i1].TMOD4, idata[i1].VMOD4]]
			];
			for (let i2 of i2pool) {
				if (i1 != i2) {
					ef2 = [
						[idata[i2].EID1, [idata[i2].MMOD1, idata[i2].TMOD1, idata[i2].VMOD1]],
						[idata[i2].EID2, [idata[i2].MMOD2, idata[i2].TMOD2, idata[i2].VMOD2]],
						[idata[i2].EID3, [idata[i2].MMOD3, idata[i2].TMOD3, idata[i2].VMOD3]],
						[idata[i2].EID4, [idata[i2].MMOD4, idata[i2].TMOD4, idata[i2].VMOD4]]
					];
					for (let i3 of i3pool) {
						pefl = [];
						if (i1 != i2 && i2 != i3 && i1 != i3) {
							pot = [];

							ef3 = [
								[idata[i3].EID1, [idata[i3].MMOD1, idata[i3].TMOD1, idata[i3].VMOD1]],
								[idata[i3].EID2, [idata[i3].MMOD2, idata[i3].TMOD2, idata[i3].VMOD2]],
								[idata[i3].EID3, [idata[i3].MMOD3, idata[i3].TMOD3, idata[i3].VMOD3]],
								[idata[i3].EID4, [idata[i3].MMOD4, idata[i3].TMOD4, idata[i3].VMOD4]]
							];

							for (let i = 0; i < 4; i++) { //1||2 проверка
								for (let j = 0; j < 4; j++) {
									if (!pefl.includes(ef1[i][0]) && ef1[i][0] == ef2[j][0]) {
										pefl.push(ef1[i][0]);
										if (ef1[i][1][2] > ef2[j][1][2]) {
											pot.push(ef1[i])
										} else {
											pot.push(ef2[j])
										};
									}
								}
							};
							for (let i = 0; i < 4; i++) { //1||3 проверка
								for (let j = 0; j < 4; j++) {
									if (!pefl.includes(ef1[i][0]) && ef1[i][0] == ef3[j][0]) {
										pefl.push(ef1[i][0]);
										if (ef1[i][1][2] > ef3[j][1][2]) {
											pot.push(ef1[i])
										} else {
											pot.push(ef3[j])
										};
									}
								}
							};
							for (let i = 0; i < 4; i++) { //2||3 проверка
								for (let j = 0; j < 4; j++) {
									if (!pefl.includes(ef2[i][0]) && ef2[i][0] == ef3[j][0]) {
										pefl.push(ef2[i][0]);
										if (ef2[i][1][2] > ef3[j][1][2]) {
											pot.push(ef2[i])
										} else {
											pot.push(ef3[j])
										};
									}
								}
							};
						};

						if (pefl.includes(eids[0]) && pefl.includes(eids[1])) {
							tpots.push([
								[i1, i2, i3].sort(), pot
							])
						};
					}
				}

			}
		}
		for (let i = 0; i < tpots.length - 1; i++) {
			for (j = i + 1; j < tpots.length; j++) {
				if (tpots[i][0].toString() == tpots[j][0].toString()) {
					tpots.splice(j, 1)
				}
			}
		};
		for (i = 0; i < edata.length; i++) {
			if (!document.getElementsByName(i)[0].checked) {
				document.getElementsByName(i)[0].disabled = true
			}
		};
		epool = eids;
		for (i of tpots) {
			for (j of i[1]) {
				if (!epool.includes(j) && j != eids[1] && j != eids[0]) {
					epool.push(j)
				}
			}
		}
		for (i = 0; i < edata.length; i++) {
			if (!epool.includes(i)) {
				document.getElementsByName(i)[0].parentElement.style.display = "none"
			}
		};
	};
};

function ListEffects() {
	document.getElementById("calcarea").innerHTML = '<div id="elist"></div>';
	let target = document.getElementById("elist");
	target.innerHTML += '<form id="efilter"><div id="positives" style="width:50%; float:left"></div><div id="negatives" style="width:50%; float:right;"></div></form>'
	positives = document.getElementById("positives");
	negatives = document.getElementById("negatives");

	for (item of edata) {
		if (item.PN == "P") {
			positives.innerHTML +=
				'<div class="effect"><label>' +
				'<input  type="checkbox" name="' + item.ID + '" value="' + item.ID + '" onclick="Refilter()"><span>' +
				item.EFFECT + '</span></label></div>'
		} else {
			negatives.innerHTML +=
				'<div class="effect"><label>' +
				'<input  type="checkbox" name="' + item.ID + '" value="' + item.ID + '" onclick="Refilter()"><span>' +
				item.EFFECT + '</span></label></div>'
		}
	}
};