window.onload = function() {
    const canvas = document.getElementById('scratchCanvas');
    const grid = document.querySelector('.grid');
    const container = document.querySelector('.container');
    const redirectButton = document.getElementById('redirectButton'); // Bouton de redirection

    // Fonction pour ajuster la taille et la position du canevas
    function updateCanvasPosition() {
        const rect = grid.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        canvas.width = rect.width + 25;
        canvas.height = rect.height;
        canvas.style.left = (rect.left - containerRect.left) + 'px';
        canvas.style.top = (rect.top - containerRect.top) + 'px';

        const ctx = canvas.getContext('2d');

        // Remplir le canevas avec la couleur de grattage
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner les indices
        drawIndices(ctx, rect.width, rect.height);
    }

    function drawIndices(ctx, width, height) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = 4;
        const rows = 3;
        const cellWidth = width / cols;
        const cellHeight = height / rows;
        const indices = [
            'Alcool Préféré', 'Pourquoi SES', 'Citation','Expériences Asso',
            'Bla-bla-bla', 'Musique pref','Sport', "C'est quoi le S",
            'Photo#1','Photo#2', 'Photo#3', 'Photo#4'
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * cellWidth + cellWidth / 2;
                const y = row * cellHeight + cellHeight / 2;
                ctx.fillText(indices[row * cols + col], x, y);
            }
        }
    }

    updateCanvasPosition();
    window.addEventListener('resize', updateCanvasPosition);

    let isDrawing = false;
    const ctx = canvas.getContext('2d');

    // Pourcentage de pixels grattés
    let scratchedPixels = 0;
    let totalPixels = canvas.width * canvas.height;
    const targetPercentage = 0.5; // 50%

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        scratch(e);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            scratch(e);
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', function() {
        isDrawing = false;
    });

    function scratch(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 35, 0, Math.PI * 2, true); // Rayon ajusté à 35 pour une meilleure couverture
        ctx.fill();

        // Met à jour la zone grattée
        updateScratchedPercentage();
    }

    function updateScratchedPercentage() {
        // Obtenir les pixels du canevas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        scratchedPixels = 0;

        // Compter les pixels grattés (pixels complètement transparents)
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) scratchedPixels++;
        }

        const scratchedPercentage = scratchedPixels / (canvas.width * canvas.height);

        // Afficher le bouton si au moins 50% est gratté
        if (scratchedPercentage >= targetPercentage) {
            redirectButton.style.display = 'block';
        }
    }
};
