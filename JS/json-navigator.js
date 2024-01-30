document.addEventListener('DOMContentLoaded', function () {
    const jsonContainer = document.getElementById('jsonContainer');
    const jsonData = gen_data['main'];

    renderJson(jsonContainer, jsonData);
});

function renderJson(container, jsonData) {
    container.innerHTML = syntaxHighlight(JSON.stringify(jsonData, null, 4));
    makeCollapsible(container);
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|true|false|null|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function makeCollapsible(container) {
    const elements = container.querySelectorAll('.collapsible');
    elements.forEach(element => {
        element.addEventListener('click', function () {
            this.classList.toggle('collapsed');
            let content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
}

// Modify renderJson to add collapsible functionality
function renderJson(container, jsonData) {
    container.innerHTML = syntaxHighlight(JSON.stringify(jsonData, null, 4));
    addCollapsibleElements(container);
    makeCollapsible(container);
}

// Function to add collapsible elements
function addCollapsibleElements(container) {
    let json = container.innerHTML;
    const regex = /"(.*?)": \{/g; // Matches property keys for objects
    container.innerHTML = json.replace(regex, '<span class="collapsible">$&</span><div style="display: block;">');
    container.innerHTML += '</div>'.repeat((json.match(regex) || []).length); // Add closing divs
}

