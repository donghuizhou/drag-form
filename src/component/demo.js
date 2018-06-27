// 之前
var result = getTableData('submit', 'check');
if (result.code == '0') { JrzlTools.alert(result.msg, '校验有误'); return; }
var curData = result.tableData;
var sumData = {};
var loadDataBefore = [];
for (var i in curData) {                      // 把表格中的数据按照起息日周期分类
  curData[i].forEach(function (item, index) {
    var flag = false;
    var valDteCycle = queryMonAndSun(item['VAL_DTE']);
    if (Object.keys(sumData).length) {
      for (var sumKey in sumData) { if (valDteCycle == sumKey) { flag = true; } }
      flag ? sumData[valDteCycle].push(item) : sumData[valDteCycle] = [item];
    } else { sumData[valDteCycle] = [item]; }
  });
}  
var keysOrdered = Object.keys(sumData).sort();
var sumDataOrdered = {};
keysOrdered.forEach(function (key) {
  sumDataOrdered[key] = sumData[key]
})

for (var beforeKey in sumDataOrdered) {
  var issScalBefore = 0, clntIncomeBefore = 0, totCstBefore = 0, compLstWeekBefore = 0;
  sumDataOrdered[beforeKey].forEach(function (item, index) {
    issScalBefore = floatAdd(issScalBefore, item['ISS_SCAL']);
    clntIncomeBefore = floatAdd(clntIncomeBefore, item['CIF_RET_RAT'] * item['ISS_SCAL']);
    totCstBefore = floatAdd(totCstBefore, item['TOT_CST'] * item['ISS_SCAL']);
  })
  if (loadDataBefore.length > 0) {
    compLstWeekBefore = (totCstBefore / issScalBefore).toFixed(2) - (loadDataBefore[loadDataBefore.length - 1]['TOT_COST'] ? loadDataBefore[loadDataBefore.length - 1]['TOT_COST'] : 0);
  } else { compLstWeekBefore = 0 }
  var tmp = {
    VAL_DTE_CYCLE: beforeKey,
    ISS_SCAL: issScalBefore.toFixed(2),
    CLNT_INCOME: (clntIncomeBefore / issScalBefore).toFixed(2),
    TOT_COST: (totCstBefore / issScalBefore).toFixed(2),
    COMP_LST_WEEK: compLstWeekBefore.toFixed(2)
  }
  loadDataBefore.push(tmp);
}
var keysArr = Object.keys(sumDataOrdered).sort();
var startDate = modifyDate(keysArr[0].split('-')[0], -7)     
var endDate = keysArr[keysArr.length - 1].split('-')[1]
var lstDte = modifyDate(keysArr[0].split('-')[0], -7) + '-' + modifyDate(keysArr[0].split('-')[0], -1)
keysArr.unshift(lstDte)
var sumSortData = {};
var loadData = [];
var prodList = []
keysArr.forEach(function (item, index) { 
  index == 0 ? sumSortData[item] = [] : sumSortData[item] = sumDataOrdered[item] 
})

Request.processDataRequest({                    
  url: '/jrzl/prjmng/product/puboffer/period/periodProdHistList.action',
  progress: false,
  errorRedirect: true,
  async: false,
  customParams: {
    APPL_COD: applCode,
    SAL_CHNL: saleChannel,
    START_DATE: startDate,
    END_DATE: endDate
  },
  callbackFunc: function (data) {
    if ("0" == data.ErrorNo) {
      prodList = data.PROD_LIST;
      for (var dateKey in sumSortData) {
        prodList.forEach(function (item, index) {
          if (item['VAL_DTE'] >= dateKey.split('-')[0] && item['VAL_DTE'] <= dateKey.split('-')[1] ) {
            sumSortData[dateKey].push(item)
          }
        })
      }
      for (var sortKey in sumSortData) {
        var issScalSum = 0, clntIncome = 0, totCst = 0, compLstWeek = 0;
        sumSortData[sortKey].forEach(function (item, index) {
          issScalSum = floatAdd(issScalSum, item['ISS_SCAL']);
          clntIncome = floatAdd(clntIncome, item['CIF_RET_RAT'] * item['ISS_SCAL']);
          totCst = floatAdd(totCst, item['TOT_CST'] * item['ISS_SCAL']);
        })
        if (loadData.length > 0) {
          compLstWeek = (totCst / issScalSum).toFixed(2) - (loadData[loadData.length - 1]['TOT_COST'] ? loadData[loadData.length - 1]['TOT_COST'] : 0);
        } else { compLstWeek = 0 }
        var tmp = {
          VAL_DTE_CYCLE: sortKey,
          ISS_SCAL: issScalSum,
          CLNT_INCOME: (clntIncome / issScalSum).toFixed(2),
          TOT_COST: (totCst / issScalSum).toFixed(2),
          COMP_LST_WEEK: compLstWeek.toFixed(2) ? compLstWeek.toFixed(2) : ''
        }
        loadData.push(tmp);
      }
      var tableCfg = {
        id: 'table_jysjSum',
        search: false,
        height: 'auto'
      }
      JrzlTools.editGrid(tableCfg, jysjSumColCfg)
      loadData.splice(0, 1)
      loadData.forEach(function (item, index) { 
        loadDataBefore[index]['COMP_LST_WEEK'] = item['COMP_LST_WEEK'] 
      })
      table_jysjSum.loadData(loadDataBefore) 
    } else {
      JrzlTools.alert((!data.ErrorMsg) ? '汇总信息失败。' : data.ErrorMsg, '提示');
    }
  }
})


// 之后
var result = getTableData('submit', 'check');
if (result.code == '0') { JrzlTools.alert(result.msg, '校验有误'); return; }
var curData = result.tableData;
var valDteKeys = [];
var dataOnPage = {};
var sumDataOnPage = [];
// 把起息日周期拿出来并进行排序
for (var i in curData) {
  curData[i].forEach(function (item, index) {
    if (valDteKeys.indexOf(queryMonAndSun(item['VAL_DTE'])) == -1) { valDteKeys.push(queryMonAndSun(item['VAL_DTE'])); }
  })
}
valDteKeys = valDteKeys.sort();
var startDate = modifyDate(valDteKeys[0].split('-')[0], -7);
var endDate = valDteKeys[valDteKeys.length - 1].split('-')[1]
var lstDte = modifyDate(valDteKeys[0].split('-')[0], -7) + '-' + modifyDate(valDteKeys[0].split('-')[0], -1);
valDteKeys.unshift(lstDte)
// 把起息日周期的值放进dataOnPage作为key，值先置为[]
valDteKeys.forEach(function (item) { dataOnPage[item] = []; });
// 遍历页面上的数据，把curData里面的值放入对应的dataOnPage中
for (var j in curData) {
  curData[j].forEach(function (item, index) {
    for (var k in dataOnPage) {
      if (item['VAL_DTE'] >= k.split('-')[0] && item['VAL_DTE'] <= k.split('-')[1]) {
        dataOnPage[k].push(item);
      }
    }
  })
}
// 遍历dataOnPage，计算出汇总表里面的值，放入sumDataOnPage中
for (var m in dataOnPage) {
  var issScalSum = 0, clntInComeSum = 0, totCstSum = 0;
  dataOnPage[m].forEach(function (item, index) {
    if (index != 0) {
      issScalSum = floatAdd(issScalSum, item['ISS_SCAL']);
      clntInComeSum = floatAdd(clntInComeSum, item['CIF_RET_RAT'] * item['ISS_SCAL']);
      totCstSum = floatAdd(totCstSum, item['TOT_CST'] * item['ISS_SCAL']);
    }
  })
  var tmp = {
    VAL_DTE_CYCLE: m,
    ISS_SCAL: issScalSum.toFixed(2) ? issScalSum.toFixed(2) : 0,
    CLNT_INCOME: (clntInComeSum / issScalSum).toFixed(2) ? (clntInComeSum / issScalSum).toFixed(2) : 0,
    TOT_COST: (totCstSum / issScalSum).toFixed(2) ? (totCstSum / issScalSum).toFixed(2) : 0,
    COMP_LST_WEEK: 0
  };
  sumDataOnPage.push(tmp);
}
Request.processDataRequest({                    
  url: '/jrzl/prjmng/product/puboffer/period/periodProdHistList.action',
  progress: false,
  errorRedirect: true,
  async: false,
  customParams: {
    APPL_COD: applCode,
    SAL_CHNL: saleChannel,
    START_DATE: startDate,
    END_DATE: endDate
  },
  callbackFunc: function (data) {
    if ("0" == data.ErrorNo) {
      var prodList = data.PROD_LIST;
      prodList.forEach(function (item, index) {
        for (var n in dataOnPage) {
          if (item['VAL_DTE'] >= n.split('-')[0] && item['VAL_DTE'] <= n.split('-')[1]) {
            dataOnPage[n].push(item);
          }
        }
        for (var p in dataOnPage) {
          issScalSum = 0, clntInComeSum = 0, totCstSum = 0;
          dataOnPage[p].forEach(function (item, index) {
            
          })
        }
      })
    } else {
      JrzlTools.alert((!data.ErrorMsg) ? '汇总信息失败。' : data.ErrorMsg, '提示');
    }
  }
})