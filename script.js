document.getElementById('btnProcessar').addEventListener('click', async () => {
    const file = document.getElementById('pdfInput').files[0];
    if (!file) return alert("Selecione um PDF");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const typedarray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let listaDados = [];

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const texto = textContent.items.map(s => s.str).join(" ");

            // Lógica Regex adaptada
            const matchNumero = texto.match(/Número.*?(\d{4}GR\d+)/i);
            const matchValor = texto.match(/Valor.*?([\d\.,]{4,})/i);
            
            if (matchNumero) {
                listaDados.push({
                    "Número": matchNumero[1],
                    "Valor": matchValor ? matchValor[1] : null
                });
            }
        }
        
        // Gerar Excel
        const ws = XLSX.utils.json_to_sheet(listaDados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados");
        XLSX.writeFile(wb, "Extracao_UEMA.xlsx");
    };
    reader.readAsArrayBuffer(file);
});

document.getElementById('btnAjuda').onclick = () => document.getElementById('modalAjuda').style.display = 'block';