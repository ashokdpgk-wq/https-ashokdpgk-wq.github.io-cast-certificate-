const SHEET_NAME = "Sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  // যদি update request আসে
  if (data.action === "update") {
    return updateOrder(sheet, data);
  }

  // যদি delete request আসে
  if (data.action === "delete") {
    return deleteOrder(sheet, data);
  }

  // নতুন order add
  sheet.appendRow([
    data.orderId,
    data.name,
    data.mobile,
    data.village,
    data.post,
    data.police,
    data.district,
    data.pin,
    data.email,
    JSON.stringify(data.items),
    data.status,
    data.date
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({status:"added"}))
    .setMimeType(ContentService.MimeType.JSON);
}


// GET: সব order fetch
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  let orders = [];

  for (let i = 1; i < data.length; i++) {
    orders.push({
      orderId: data[i][0],
      name: data[i][1],
      mobile: data[i][2],
      village: data[i][3],
      post: data[i][4],
      police: data[i][5],
      district: data[i][6],
      pin: data[i][7],
      email: data[i][8],
      items: JSON.parse(data[i][9] || "[]"),
      status: data[i][10],
      date: data[i][11]
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify(orders))
    .setMimeType(ContentService.MimeType.JSON);
}


// 🔄 UPDATE STATUS
function updateOrder(sheet, data) {
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.orderId) {
      sheet.getRange(i + 1, 11).setValue(data.status); // status column
      return ContentService.createTextOutput(JSON.stringify({status:"updated"}));
    }
  }
}


// ❌ DELETE ORDER
function deleteOrder(sheet, data) {
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.orderId) {
      sheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({status:"deleted"}));
    }
  }
}