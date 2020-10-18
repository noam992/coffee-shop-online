function updateObject(previous, current) {
    
    // Update previous obj in new value from current
    // previous- include property names and old value (whole obj/model);
    // current- include property names that got a new value;
    for (const newProp in current) {

        for (const oldProp in previous) {
            if (oldProp === newProp) {

                // Extra safe - check if current value is'nt undefined
                if (current[newProp] === undefined) {
                    break;
                }

                previous[oldProp] = current[newProp];
                break; //Stop this loop, we found it!
            }
        }

    }

    return previous
}

module.exports = {
    updateObject
}