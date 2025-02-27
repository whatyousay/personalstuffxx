function sort_alphabetically(text) {
    return text.split('\n').sort().join('\n');
}


function randomize_case(word) {
    return word.split('').map(function(letter) {
        return Math.random() < 0.5 ? letter.toUpperCase() : letter.toLowerCase();
    }).join('');
}


function trim_spaces(text) {
    let lines = text.split("\n");
    let temp = [];
    lines.forEach((item) => {
        temp.push(item.trim());
    });
    return temp.join("\n");
}


function wait_for_element(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


// Quick and simple export target #table_id into a csv
function download_table_as_csv(id) {
    let table_id = id, separator = ';'

    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function makeid(length) { // This is to avoid YouTube spam filter
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}


// This function is just for generating the Ids for the elements
function getRandomInt() {
    return Math.floor(Math.random() * (10000000 - 0) + 0);
}


// This function is to wait for the GM Config to avoid Chromium based error
function wait_for_gm_config() {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            if (typeof GM_config !== "undefined" && GM_config.get) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}
