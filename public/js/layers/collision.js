function createEntityLayer(entities) {
    return function drawBoundingBoxes(context, camera) {
        context.strokeStyle = 'red';
        entities.forEach(entity => {
            context.beginPath();
            context.rect(
                entity.bounds.left - camera.pos.x,
                entity.bounds.top - camera.pos.y,
                entity.size.x,
                entity.size.y
            );
            context.stroke();
        })
    }
}

function createTileCandidate(tileCollider) {
    const resolvedTiles = [];

    const tileResolver = tileCollider.tiles;
    const tileSize = tileResolver.tileSize;

    const getByIndexOriginal = tileResolver.getByIndex;
    tileResolver.getByIndex = function getByIndexSpy(x, y) {
        resolvedTiles.push({ x, y });
        return getByIndexOriginal.call(tileResolver, x, y);
    }

    return function drawTileCandidates(context, camera) {
        context.strokeStyle = 'blue';
        resolvedTiles.forEach(({ x, y }) => {
            context.beginPath();
            context.rect(
                x * tileSize - camera.pos.x,
                y * tileSize - camera.pos.y,
                tileSize, tileSize
            );
            context.stroke();
        });

        resolvedTiles.length = 0;
    }
}

export function createCollisionLayer(level) {
    const drawBoundingBoxes = createEntityLayer(level.entities);
    const drawTileCandidates = createTileCandidate(level.tileCollider);

    return function drawCollision(context, camera) {
        drawTileCandidates(context, camera);
        drawBoundingBoxes(context, camera);
    };
}