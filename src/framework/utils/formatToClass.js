const SystemCodetoClass = (equipmentAll, str) => {
    if (str) {
        let code1 = str.slice(0, 2);
        let code2 = str.slice(0, 4);
        let code3 = str
        let item1
        if (equipmentAll) {
            item1 = equipmentAll.find(i => i.id === code1);
        }
        if (item1) {
            let item2 = item1.children.find(i => i.id === code2);
            if (item2) {
                let item3 = item2.children.find(i => i.id === code3);
                return item3 ? item3.name : item2.name;
            } else {
                return item1 ? item1.name : ""
            }
        }
    }
}
const formatterCode = (strand, arr) => {
    if (strand && arr) {
        const userObj = arr.find(el => el.value == strand)
        return userObj ? userObj.label : ''
    } else {
        return ''
    }
}
module.exports = {
    SystemCodetoClass,
    formatterCode
}
