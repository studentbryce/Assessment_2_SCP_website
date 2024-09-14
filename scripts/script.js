function DisplayData() {
    // Fetch data from the JSON file
    fetch('scripts/scp_data.json')
        .then(response => response.json())
        .then(data => {
            // Determine the current page
            const pageTitle = document.title; // Or use another method to get the page identifier

            // Filter data based on the current page title
            const pageData = data.find(page => page.title === pageTitle);

            // Reference to the main div
            const rootDiv = document.getElementById('root');

            if (pageData) {
                // Create HTML content based on the filtered data from JSON file using "title" key to find pageData
                const content = `
                    <h1><b>Item #: </b>${pageData.title}</h1>
                    <h2><b>Object Class: </b>${pageData.object_class}</h2>
                    ${pageData.image ? `<p><img src="${pageData.image.src}" alt="${pageData.image.alt}"></p>` : ''}
                    ${pageData.special_containment_procedures ? `
                        <h3>Special Containment Procedures:</h3>
                        ${Array.isArray(pageData.special_containment_procedures) ?
                            `<p>${pageData.special_containment_procedures.map(item => item).join('')}</p>` :
                            `<p>${pageData.special_containment_procedures}</p>`}` : ''}
                            <button onclick="Read('${pageData.special_containment_procedures}')">Read out Special Containment Procedures</button>
                    ${pageData.ordered_list ? `
                        <ol>${pageData.ordered_list.map(item => `<li>${item}</li>`).join('')}</ol>` : ''}
                    ${Array.isArray(pageData.description) ? `
                        <h3>Description:</h3>
                        ${pageData.description.map(desc => `<p>${desc}</p>`).join('')}` :
                        pageData.description ? `
                        <h3>Description:</h3>
                        <p>${pageData.description}</p>` : ''}
                        <button onclick="Read('${pageData.description}')">Read out Description</button>
                    ${pageData.reference ? `
                        <h3>Reference:</h3>
                        ${pageData.reference.map(ref => `<p>${ref}</p>`).join('')}` : ''}
                    ${pageData.history ? `
                        <h4>Chronological History</h4>
                        ${pageData.history.map(entry => `<p><b>${entry.date}:</b> ${entry.event}</p>`).join('')}` : ''}
                    ${pageData.anomalies ? `
                        <h4>Space-Time Anomalies</h4>
                        <p>${pageData.anomalies}</p>` : ''}
                    ${pageData.additional_notes ? `
                        <h4>Additional Notes:</h4>
                        <p>${pageData.additional_notes}</p>` : ''}                
                    ${pageData.addenda ? `
                        <h4>Addenda:</h4>
                        ${Object.entries(pageData.addenda).map(([key, value]) =>
                            Array.isArray(value) ? `
                                <h4>Addendum ${key}:</h4>
                                ${value.map(paragraph => `<p>${paragraph}</p>`).join('')}` :
                                `<h4>Addendum ${key}:</h4>
                                <p>${value}</p>`
                        ).join('')}` : ''}
                    ${pageData.appendix ? `
                        ${Object.entries(pageData.appendix).map(([key, value]) => `
                            <h4>Appendix ${key}</h4>
                            ${Array.isArray(value) ? value.map(item => `<p>${item}</p>`).join('') : `<p>${value}</p>`}`).join('')}` : ''}
                `;

                // Append the content to the root div
                rootDiv.innerHTML = content;
            } else {
                rootDiv.innerHTML = '<p>No data found for this page.</p>';
            }
        })
        .catch(error => console.error("Error fetching data: ", error));
}

// Read function using Speech Synthesis Utterance
function Read(special_containment_procedures, description, reference)
{
    // create new instance of a speach SynthesisUtterance
    const speech = new SpeechSynthesisUtterance();
    // set speech to be spoken
    speech.text = special_containment_procedures, description, reference;
    // set voice
    speech.voice = speechSynthesis.getVoices()[0];
    // speak function
    speechSynthesis.speak(speech);
}
