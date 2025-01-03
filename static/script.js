const buyingGroupMap = new Map();
buyingGroupMap.set("PREMIER", "50GWCWP00");
buyingGroupMap.set("HEALTHTRUST", "00000000");
buyingGroupMap.set("AMERINET COURTESY", "00000000");
buyingGroupMap.set("VIZIENT", "M1ME0E100");
buyingGroupMap.set("NORTHWELL", "00000000");
buyingGroupMap.set("MEDIGROUP", "00000000");
buyingGroupMap.set("MEDASSETS", "M1ME0E100");
buyingGroupMap.set("MAGNET", "00000000");
buyingGroupMap.set("APTITUDE", "00000000");

const isaID = document.getElementById("isaID");
isaID.value = generateID();
const gsID = document.getElementById("gsID");
gsID.value = generateID();
const stID = document.getElementById("stID");
stID.value = generateID();

// const currentDateTime = document.getElementById("currentDateTime").value;

const senderQualifier = document.getElementById("senderQualifier");
const senderId = document.getElementById("senderId");
const receiverQualifier = document.getElementById("receiverQualifier");
const receiverId = document.getElementById("receiverId");

const bpa = document.getElementById("bpa");

const contract = document.getElementById("contract");
const contractStart = document.getElementById("contractStart");
const contractEnd = document.getElementById("contractEnd");

const gpoOrEndUser = document.getElementById("gpoOrEndUser");
const addChangeDelete = document.getElementById("addChangeDelete");
const endUsers = document.getElementById("endUsers");

const addChangeDeleteItems = document.getElementById("addChangeDeleteItems");
const items = document.getElementById("items");

// Generate a random 9-digit number that doesn't start with 0
function generateID() {
  return Math.floor(Math.random() * 900000000 + 100000000).toString();
}

function keyExists(key) {
  return localStorage.getItem(key) !== null;
}

function parseEligible() {
  const endUsersValue = endUsers.value;
  const gpoOrEndUserValue = gpoOrEndUser.value;
  const addChangeDeleteValue = addChangeDelete.value;
  const endUsersArray = endUsersValue.split("\n");

  const mapped = [];

  for (i = 0; i < endUsersArray.length; i++) {
    const endUserArray = endUsersArray[i].split(",");

    if (endUserArray.length < 3) {
      continue;
    }

    console.log(endUserArray);

    const endUserName = (endUserArray[0]?.trim() || "").toUpperCase();

    let endUserEffectiveDate = endUserArray[1].trim().replace(/-/g, "");
    if (endUserEffectiveDate === "@") {
      endUserEffectiveDate = contractStart.value.slice(0, 10).replace(/-/g, "");
    }

    let endUserExpirationDate = endUserArray[2].trim().replace(/-/g, "");
    if (endUserExpirationDate === "@") {
      endUserExpirationDate = contractEnd.value.slice(0, 10).replace(/-/g, "");
    }

    console.log(gpoOrEndUserValue);

    if (gpoOrEndUserValue === "BG") {
      const endUserLine = `N1*BG*${endUserName}*21*${buyingGroupMap.get(
        endUserName
      )}`;

      mapped.push(endUserLine);
    } else {
      const endUserID = endUserArray[3].trim().toUpperCase();
      const endUserAddr = endUserArray[4].trim().toUpperCase();
      const endUserCity = endUserArray[5].trim().toUpperCase();
      const endUserState = endUserArray[6].trim().toUpperCase();
      const endUserZip = endUserArray[7].trim().toUpperCase();

      const endUserLine = `N1*EB*${endUserName}*91*${endUserID}`;
      const endUserN3Line = `N3*${endUserAddr}`;
      const endUserN4Line = `N4*${endUserCity}*${endUserState}*${endUserZip}`;

      mapped.push(endUserLine);
      mapped.push(endUserN3Line);
      mapped.push(endUserN4Line);
    }

    const refTDLine = `REF*TD*${addChangeDeleteValue}`;
    const dtm129Line = `DTM*129*${endUserEffectiveDate}`;
    const dtm130Line = `DTM*130*${endUserExpirationDate}`;

    mapped.push(refTDLine);
    mapped.push(dtm129Line);
    mapped.push(dtm130Line);
  }

  return mapped;
}

function parseItems() {
  const itemsValue = items.value;
  const addChangeDeleteItemsValue = addChangeDeleteItems.value;
  const contractStartDateStr = contractStart.value.replace(/-/g, ""); // YYYYMMDD
  const contractEndDateStr = contractEnd.value.replace(/-/g, ""); // YYYYMMDD
  const itemsArray = itemsValue.trim().split("\n");

  const mapped = [];

  let count = 0;

  for (let i = 0; i < itemsArray.length; i++) {
    count += 1;

    const itemArray = itemsArray[i].split("\t");

    if (itemArray.length < 9) {
      continue;
    }

    const itemID = itemArray[0].trim().toUpperCase();
    const itemDesc = itemArray[2].trim().toUpperCase();
    let itemPrice = itemArray[8].trim().toUpperCase().replace("$", "");
    if (itemPrice.includes(".")) {
      //
    } else {
      itemPrice = itemPrice + ".00";
    }

    const pad = `PAD*${count}**${addChangeDeleteItemsValue}`;
    const pid = `PID*F****${itemDesc}`;
    const dtm131 = `DTM*131*${contractStartDateStr}`;
    const dtm132 = `DTM*132*${contractEndDateStr}`;
    const lin = `LIN*${count}*MG*${itemID}`;
    const ctp = `CTP*DI*CON*${itemPrice}`;

    mapped.push(pad);
    mapped.push(pid);
    mapped.push(dtm131);
    mapped.push(dtm132);
    mapped.push(lin);
    mapped.push(ctp);
  }

  mapped.push(count);

  return mapped;
}

// Populate the generated IDs
function initializeIDs() {
  if (!keyExists("senderQualifier")) {
    localStorage.setItem("senderQualifier", "01");
  }
  if (!keyExists("senderId")) {
    localStorage.setItem("senderId", "002418234T");
  }
  if (!keyExists("bpa")) {
    localStorage.setItem("bpa", document.getElementById("bpa").value);
  }
  if (!keyExists("contract")) {
    localStorage.setItem("contract", "");
  }
  if (!keyExists("contractStart")) {
    localStorage.setItem("contractStart", new Date());
  }
  if (!keyExists("contractEnd")) {
    localStorage.setItem("contractEnd", new Date());
  }

  document.getElementById("isaID").value = generateID();
  document.getElementById("gsID").value = generateID();
  document.getElementById("stID").value = generateID();

  document.getElementById("senderQualifier").value =
    localStorage.getItem("senderQualifier");
  document.getElementById("senderId").value = localStorage.getItem("senderId");

  document.getElementById("bpa").value = localStorage.getItem("bpa");
  document.getElementById("contract").value = localStorage.getItem("contract");
  document.getElementById("contractStart").value =
    localStorage.getItem("contractStart");
  document.getElementById("contractEnd").value =
    localStorage.getItem("contractEnd");

  console.log("Initialized IDs");
}

// Generate the ISA Line
function generateEDI() {
  const date = new Date();
  const fullYearDateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const timeStr = date.toTimeString().slice(0, 5).replace(":", ""); // HHMM
  const contractStartDateStr = contractStart.value.replace(/-/g, ""); // YYYYMMDD
  const contractEndDateStr = contractEnd.value.replace(/-/g, ""); // YYYYMMDD

  const isaLine = `ISA*00*          *00*          *${
    senderQualifier.value
  }*${senderId.value.padEnd(15)}*${
    receiverQualifier.value
  }*${receiverId.value.padEnd(15)}*${dateStr}*${timeStr}*U*00401*${
    isaID.value
  }*0*P*~`;

  const gsLine = `GS*PA*${senderId.value}*${
    receiverId.value == "943561654" ? "HS845" : receiverId.value
  }*${fullYearDateStr}*${timeStr}*${gsID.value}*X*004010`;

  const stLine = `ST*845*${stID.value}`;

  const bpaLine = `BPA*${bpa.value}*${fullYearDateStr}${
    receiverId.value == "943561654" ? "" : "*ZZ*GPO"
  }`;

  const conLine = `CON*CT*${contract.value}*${
    receiverId.value == "943561654" ? "VA" : "OC"
  }`;

  const refCTLine = "REF*CT*LOI";
  const refBCLine = `REF*BC*${contract.value}`;
  const refDTM092 = `DTM*092*${contractStartDateStr}`;
  const refDTM093 = `DTM*093*${contractEndDateStr}`;

  const senderN1 = `N1*MF*BUSSE HOSPITAL DISPOSABLES*UL*0849233000001`;

  const eligibleBuyers = parseEligible();

  const items = parseItems();
  const count = items.pop();

  const cttLine = `CTT*${count}`;

  const isaGsSt = [isaLine, gsLine, stLine];

  const body = [bpaLine];

  if (receiverId.value == "943561654") {
    body.push(conLine);
  } else {
    body.push(senderN1);
    body.push(conLine);
  }

  if (receiverId.value == "943561654") {
    body.push(refCTLine);
  }

  body.push(...[refBCLine, refDTM092, refDTM093]);

  if (receiverId.value == "943561654") {
    body.push(senderN1);
  }

  body.push(...[...eligibleBuyers, ...items, cttLine]);

  for (let i = 0; i < body.length; i++) {
    console.table(i, body[i]);
  }

  const seLine = `SE*${body.length + 2}*${stID.value}`;

  const geLine = `GE*1*${gsID.value}`;

  const ieaLine = `IEA*1*${isaID.value}`;

  const seGeIea = [seLine, geLine, ieaLine];

  let outputValue = [...isaGsSt, ...body, ...seGeIea].join("\n");

  // Set the generated ISA line in the output
  document.getElementById("output").value = outputValue;
}

function saveToLocalStorage(event) {
  const inputId = event.target.id; // Get the ID of the input field
  const inputValue = event.target.value; // Get the value of the input field

  // Save the value in localStorage using the input ID as the key
  localStorage.setItem(inputId, inputValue);

  console.log(`Saved: ${inputId} = ${inputValue}`);
}

// Get all input elements
const inputs = document.querySelectorAll("input");

// Attach the input event listener to each input field
inputs.forEach((input) => {
  // Initialize the input with the value from localStorage if available
  const savedValue = localStorage.getItem(input.id);
  if (savedValue) {
    input.value = savedValue;
  }

  // Listen for changes and save to localStorage
  input.addEventListener("input", saveToLocalStorage);
});

// Get all select elements
const selects = document.querySelectorAll("select");

selects.forEach((select) => {
  const savedValue = localStorage.getItem(select.id);
  if (savedValue) {
    select.value = savedValue;
  }

  select.addEventListener("change", saveToLocalStorage);
});

// Initialize IDs on page load
window.onload = initializeIDs;

// Add event listener to the Generate ISA button
document.getElementById("generateEDI").addEventListener("click", generateEDI);
