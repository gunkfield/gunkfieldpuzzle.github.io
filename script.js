// Puzzle Piece Game in JavaScript

// Initialize canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
document.body.appendChild(canvas);

// Puzzle settings
const ROWS = 5;
const COLS = 5;
const PUZZLE_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj74JlaaITrVY9mqRcpRtQRNCk7Y5RC54QvA&s"; // Replace with your image path
const pieces = [];
const originalPositions = [];
let image, pieceWidth, pieceHeight;
let selectedPiece = null;

// Load puzzle image
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Create puzzle pieces
function createPieces() {
    pieceWidth = image.width / COLS;
    pieceHeight = image.height / ROWS;

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const piece = {
                sx: col * pieceWidth,
                sy: row * pieceHeight,
                dx: col * pieceWidth,
                dy: row * pieceHeight,
            };
            pieces.push(piece);
            originalPositions.push({ dx: piece.dx, dy: piece.dy });
        }
    }

    shufflePieces();
}

// Shuffle pieces
function shufflePieces() {
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i].dx, pieces[j].dx] = [pieces[j].dx, pieces[i].dx];
        [pieces[i].dy, pieces[j].dy] = [pieces[j].dy, pieces[i].dy];
    }
}

// Draw pieces
function drawPieces() {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (const piece of pieces) {
        ctx.drawImage(
            image,
            piece.sx,
            piece.sy,
            pieceWidth,
            pieceHeight,
            piece.dx + SCREEN_WIDTH / 4,
            piece.dy + SCREEN_HEIGHT / 4,
            pieceWidth,
            pieceHeight
        );
    }
}

// Get piece at position
function getPieceAtPos(x, y) {
    const col = Math.floor((x - SCREEN_WIDTH / 4) / pieceWidth);
    const row = Math.floor((y - SCREEN_HEIGHT / 4) / pieceHeight);
    return pieces.find(piece =>
        piece.dx === col * pieceWidth && piece.dy === row * pieceHeight
    );
}

// Swap positions
function swapPositions(piece1, piece2) {
    [piece1.dx, piece2.dx] = [piece2.dx, piece1.dx];
    [piece1.dy, piece2.dy] = [piece2.dy, piece1.dy];
}

// Check if puzzle is solved
function isSolved() {
    return pieces.every((piece, index) =>
        piece.dx === originalPositions[index].dx &&
        piece.dy === originalPositions[index].dy
    );
}

// Event listeners
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    selectedPiece = getPieceAtPos(x, y);
});

canvas.addEventListener("mouseup", (event) => {
    if (!selectedPiece) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const targetPiece = getPieceAtPos(x, y);

    if (targetPiece && targetPiece !== selectedPiece) {
        swapPositions(selectedPiece, targetPiece);
    }

    selectedPiece = null;

    if (isSolved()) {
        setTimeout(() => alert("What does Butter Pants say to Shrek five times out of his nine total lines? ABNAAEMEOHTNSNW"), 100);
    }
});

// Game loop
function gameLoop() {
    drawPieces();
    requestAnimationFrame(gameLoop);
}

// Start game
loadImage(PUZZLE_IMAGE)
    .then((img) => {
        image = img;
        createPieces();
        gameLoop();
    })
    .catch((err) => console.error("Failed to load image", err));
