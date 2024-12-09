function handleGaps(data, pos, item, isUpdate) {
    let updatedPositionItem = null;

    if (data.length < 100 && pos > data.length) {
        if (Math.abs(data.length - pos) > 1) {
            let newPos = data.length;
            updatedPositionItem = { ...item, position: ++newPos };
            data.push(updatedPositionItem);
        } else {
            data.push(item);
        }
    } else {  
        if (isUpdate) {
            data.splice(pos - 1, 0, item);    
        } else {
            const index = data.findIndex((item) => item.position === pos);
            data.splice(index, 0, item);

            for (let i = index + 1; i < data.length; i++) {
                data[i].position += 1;
            }

            if (data.length > 100) {
                data.pop();
            }
        }
    }

    return updatedPositionItem;
}

module.exports = handleGaps;