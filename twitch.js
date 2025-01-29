const twitch_host = 'irc-ws.chat.twitch.tv';
const twitch_port = 443;
let socket;
let timer;
let reconnect_interval = 5000;


function main() {
    if(GM_config.get("script_enabled"))
        if(GM_config.get("auth_username") != "" && GM_config.get("auth_oauth") != "") {
            wait_for_element('.chat-input .community-points-summary').then(async () => {

                if(GM_config.get("voucher_buttons"))
                    generate_voucher_buttons();

                connect_to_twitch();
                generate_command_buttons();
            });
        }
        else
            setup_info();
}


function setup_info() { // Warning if people haven't set up the oauth token correctly
    wait_for_element('.chat-input .community-points-summary').then(async () => {
        let html = `<div id="actions" class="k-buttongroups"><label class="k-buttongroup-label">Hello thank you for installing my Twitch userscript for this channel.<br><br>Click on the Tampermonkey extension and click on settings underneath the script and insert your username + oauth token in order to be able to connect to the chat with this script.</label></div>`;
        document.querySelector(".chat-input").insertAdjacentHTML('beforebegin', html);
    });
}


function connect_to_twitch() {
    socket = new WebSocket(`wss://${twitch_host}:${twitch_port}`);
    socket.onopen = () => {
        console.log('Twitch connection started.');

        socket.send(`PASS ${GM_config.get("auth_oauth").includes("oauth:") ? GM_config.get("auth_oauth") : "oauth:" + GM_config.get("auth_oauth")}`);
        socket.send(`NICK ${GM_config.get("auth_username")}`);
        socket.send(`JOIN #${twitch_channel}`);

        timer = setInterval(function() {
            socket.send('PING :tmi.twitch.tv');
        }, 5 * 60 * 1000); // Send all 5 minutes a ping
    };

    socket.onclose = function() {
        console.log('Twitch connection closed.');

        // Stoppe den Timer, wenn die Verbindung geschlossen wurde
        clearInterval(timer);

        // Versuche, die Verbindung automatisch neu zu öffnen
        setTimeout(function() {
            connect_to_twitch();
        }, reconnect_interval);
    };
}


function close_target() {
    switch_panel(null);
}


function switch_panel(event) {
    document.querySelector("#actions").classList.toggle("hidden");
    document.querySelector("#targets").classList.toggle("hidden");
    if(event)
        document.querySelector("#targets").setAttribute("data-action", event.target.getAttribute("cmd"));
}


function send_command(event) {
    let cmd = "";
    if(event.target.parentNode.parentNode.getAttribute("data-action")) {
        cmd = event.target.parentNode.parentNode.getAttribute("data-action"); // Add action attack or devine in case its from the switched panel
        // Remove the data and go back to main panel
        event.target.parentNode.parentNode.setAttribute("data-action", "");
        switch_panel(null);
    }
    cmd += event.target.getAttribute("cmd");

    let suffix = "";
    if(cmd.trim() !== "" && cmd !== null)
        if(GM_config.get("bypass_shadowban"))
            sendMessageToTwitchChat(`${suffix}${randomize_case(cmd)}`);
        else
            sendMessageToTwitchChat(`${suffix}${cmd}`);
    else
        alert("Please contact script creator, this button doesn't seem to work correctly");
}


function sendMessageToTwitchChat(message) {
    socket.send(`PRIVMSG #${twitch_channel} :${message}`);

    socket.onerror = (error) => {
        console.error('Error:', error);
    };
}


function btngrp_label(label) {
    return `<label class="k-buttongroup-label">${label}</label>`;
}


function btngrp_button(cmd, text, classes = "actionbutton") {
    return `<button cmd="${cmd}" class="${classes}">${text}</button>`;
}


function lblgrp_label(role, name) { // GF only
    return `<label class="k-selection-label" data-role="${role}">${name}</label>`;
}


function generate_voucher_button(voucher, cost, text) {
    return `<button voucher="${voucher}" cost="${cost}" class="actionbutton get_voucher_button">${text}</button>`
}


function insert_command_button(buttongroups) {
    let html = `<div id="actions" class="k-buttongroups">${buttongroups}</div>`;
    document.querySelector(".chat-input").insertAdjacentHTML('beforebegin', html);

    document.querySelector(".k-buttongroup .closebutton")?.addEventListener("click", close_target, false);

    document.querySelectorAll(".k-buttongroup .actionbutton").forEach(el => {el.addEventListener("click", send_command, false)});
    // GF only
    document.querySelectorAll(".k-buttongroup .targetbutton").forEach(el => {el.addEventListener("click", switch_panel, false)});
    document.querySelectorAll(".k-selection-label").forEach(el => {el.addEventListener("click", show_role, false)});
}


function insert_voucher_buttons(html) {
    wait_for_element('.chat-input__buttons-container').then(async () => {
        html = `<div class="k-buttongroups"><div class="k-buttongroup">${html}</div></div>`;
        document.querySelector(".chat-input").insertAdjacentHTML('afterend', html);
        let buttons = document.querySelectorAll(".get_voucher_button");
        buttons.forEach(button => {
            button.addEventListener("click", purchase_voucher, false);
        });
    });
}


async function purchase_voucher(trigger) {
    let voucher = trigger.target.attributes.voucher.value;
    let cost = parseInt(trigger.target.attributes.cost.value);
    let storebutton = document.querySelector(".community-points-summary button");
    storebutton.click();
    wait_for_element('.rewards-list').then(async () => { // Wait till rewards list is showing
        let rewards = document.querySelector(".rewards-list");
        let reward = rewards.querySelector(`img[alt="${voucher}"]`);
        if(reward) { // Open the voucher buy menu
            reward.click();
            wait_for_element('.reward-center-body button.ScCoreButton-sc-ocjdkq-0').then(async () => { // Wait till voucher item is showing
                let reward_redeem_button = document.querySelector(".reward-center-body button.ScCoreButton-sc-ocjdkq-0");
                if(reward_redeem_button.disabled == false)
                    reward_redeem_button.click();
                else {
                    storebutton.click();
                    alert("Error: Reward not available, maybe you reached maximum amount of claims for this stream or you don't have enough channel points!");
                }
            });
        }
        else
            alert("Error: Reward not found maybe they are disabled at the moment, if not than please contact script creator via Discord");
    });
}


// Add custom styles
let styles = `
#configuration {color: black; height:auto !important; width:auto !important; padding:20px !important;max-height: 600px !important;max-width:500px !important; border: 3px solid #000 !important} #configuration .section_header {background: unset; color:unset;} #configuration .config_header {font-size:17pt; font-weight:bold} #configuration .config_var {margin-top:10px; display: flex;} .config_var :nth-child(2) {order:-1; margin-right:10px;} #configuration_buttons_holder {text-align: center;} #configuration #configuration_resetLink {color:#fff;}


.actionbutton,
.targetbutton {
min-width:40px;


background-color: var(--color-background-button-primary-default);
color: var(--color-text-button-primary);

display: inline-flex;
position: relative;
-moz-box-align: center;
align-items: center;
-moz-box-pack: center;
justify-content: center;
vertical-align: middle;
overflow: hidden;
text-decoration: none;
text-decoration-color: currentcolor;
white-space: nowrap;
user-select: none;
font-weight: var(--font-weight-semibold);
font-size: var(--button-text-default);
height: var(--button-size-default);
border-radius: var(--input-border-radius-default);
}

.k-buttongroups {
padding-left: 20px;
padding-right: 20px;}

.k-buttongroup {
display: flex;
flex-wrap: wrap;
grid-column-gap: 10px;}

.k-buttongroup-label {}

.k-buttongroup > button {
min-width:50px;
margin-bottom:5px;}

.k-labelgroup {
margin-top: 10px;
font-size: 20px;
justify-content: space-between;
display: flex;}
.hidden { display:none;}
    `;
// Insert custom Styles
let style_sheet = document.createElement("style");
style_sheet.innerText = styles;
document.head.appendChild(style_sheet);
