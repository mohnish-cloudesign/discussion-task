//Read all the existing messages from local storage
const data = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : [];
let str = ``;
let currentQIndex

//Pass message array to chat tree ui
renderMessages(data);

function renderMessages(jsonData) {
    let ele = document.getElementById("message-body");
    str = ``;
    jsonData.forEach((element, index) => {
        updateMsg(element, [index]);
    });
    ele.innerHTML = str;
}

//recursive function used to render message card
function updateMsg(element, cindex, margin = 0, replyCnt = 0) {
    str += `
        <div class="mt-10 msg-container" style="margin-left:${margin}px;">
            <div>
                <label>${element.user}</label>
                <span class="ml-20">${getFormatedTime(element.created_at)}</span>
            </div>
            <div class="mt-10">
                <label>
                    <b>${element.msg}</b>
                </label>
            </div>
            <div class="mt-10">
                <span class="mr-10">${element.likes}</span>
                <span class="mr-10">
                    <button class="btn bg-color-success" onclick="like(${JSON.stringify(cindex)})">^</button>
                </span>
                <span class="mr-10">
                    <button class="btn bg-color-danger" onclick="disLike(${JSON.stringify(cindex)})">v</button>
                </span> 
                <span class="mr-10">
                    <button class="btn bg-color-primary" onclick="showReplyBox(${JSON.stringify(cindex)})">Reply </button>
                </span>
            </div>
        </div>`;
    if (element.addnewReplyEnabled) {
        str += `<div class="mt-10" style="margin-left:${margin}px;"><input type="text" class="w-50 topic_input ml-5pr" placeholder="enter your reply message.." name="new_topic" onchange="addNewReply(this.value,${JSON.stringify(cindex)})"/></div>`
    }
    if (element.replies && element.replies.length) {
        let cnt = replyCnt + 1;
        element.replies.forEach((e, index) => {
            let newIn = cindex;
            if (index !== 0) {
                newIn.length = cnt
            }
            newIn.push(index)
            updateMsg(e, newIn, (cnt) * 15, cnt)
        });
    }
}

//show reply box on reply button click
function showReplyBox(cind) {
    let existingJson = data;
    if (cind && cind.length) {
        if (cind.length === 1) {
            existingJson[cind[0]]["addnewReplyEnabled"] = true;
            localStorage.setItem("data", JSON.stringify(existingJson))
            renderMessages(existingJson)
        } else {
            updateJson(cind, requestTtype.ADD_REPLY_BOX)
        }
    }
}

// trigger when user enter reply and press enter
function addNewReply(val, cind) {
    let existingJson = data;
    if (cind && cind.length && val) {
        let schema = {
            "msg": val,
            "likes": 0,
            "user": users[getRandomNumber(users.length)],
            "created_at": new Date().getTime(),
            "replies": []
        }
        if (cind.length === 1) {
            existingJson[cind[0]].addnewReplyEnabled = false;
            existingJson[cind[0]].replies.push(schema)
            localStorage.setItem("data", JSON.stringify(existingJson))
            renderMessages(existingJson)
        } else {
            updateJson(cind, requestTtype.ADD_NEW_REPLY, schema)
        }
    }
}

//to like specific message
function like(cind) {
    let existingJson = data;
    if (cind && cind.length) {
        if (cind.length === 1) {
            existingJson[cind[0]].likes = existingJson[cind[0]].likes ? parseInt(existingJson[cind[0]].likes) + 1 : 1
            localStorage.setItem("data", JSON.stringify(existingJson))
            renderMessages(existingJson)
        } else {
            updateJson(cind, requestTtype.ADD_LIKE)
        }
    }
}

//to dislike specific message
function disLike(cind) {
    let existingJson = data;
    if (cind && cind.length) {
        if (cind.length === 1) {
            existingJson[cind[0]].likes = existingJson[cind[0]].likes ? parseInt(existingJson[cind[0]].likes) - 1 : 0
            localStorage.setItem("data", JSON.stringify(existingJson))
            renderMessages(existingJson)
        } else {
            updateJson(cind, requestTtype.ADD_DISLIKE)
        }
    }
}

//function to update JSON after each operation
function updateJson(cind, type, schema = {}) {
    let existingJson = data;
    let child = existingJson[cind[0]].replies[cind[1]]
    for (let i = 2; i < cind.length; i++) {
        if (!child)
            break
        child = child.replies[cind[i]]
    }
    switch (type) {
        case requestTtype.ADD_NEW_REPLY:
            child["addnewReplyEnabled"] = false;
            child["replies"].push(schema)
            break
        case requestTtype.ADD_REPLY_BOX:
            child["addnewReplyEnabled"] = true;
            break
        case requestTtype.ADD_LIKE:
            child["likes"] = child["likes"] ? parseInt(child["likes"]) + 1 : 1
            break
        case requestTtype.ADD_DISLIKE:
            child["likes"] = child["likes"] ? parseInt(child["likes"]) - 1 : 0
            break
    }
    localStorage.setItem("data", JSON.stringify(existingJson))
    renderMessages(existingJson)
}

//initialize new discussion
function beginNewDiscussion(val) {
    let existingJson = data;
    let schema = {
        "msg": val,
        "likes": 0,
        "user": users[getRandomNumber(users.length)],
        "time": "",
        "created_at": new Date().getTime(),
        "replies": []
    }
    existingJson.push(schema)
    document.getElementById("new_topic").value = "";
    localStorage.setItem("data", JSON.stringify(existingJson))
    renderMessages(existingJson)
}

