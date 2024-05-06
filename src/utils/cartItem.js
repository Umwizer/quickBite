class cartItem {
    constructor(item, quantity) {
        this.item = item;
        this.quantity = quantity;
    }
    get total() {
        return this.item.price * this.quantity;
    }
}
export default cartItem;