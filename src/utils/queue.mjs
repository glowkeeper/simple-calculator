/* 
Implementation of a Queue as a double linked list
*/

export const queue = () => {

    let size = 0;
    let head, rear = null;

    function enQueue(data) {

        let newNode = {data : data, next : null, previous: rear};

        if (!head) {
            head = newNode;
            rear = newNode;
        } else {
            rear.next = newNode;
            rear = newNode;
        }

        size++;
    }

    function deQueue() {
        const thisHead = head;
        const nextHead = head.next;
        head = nextHead;
        size--;
        return thisHead.data;
    }

    function front() {
        return head.data;
    }

    function back() {
        return rear.data;
    }

    function getSize() {
        return size;
    }

    function toArray() {

        const list = [];
        let current = head;
        while (current) {
            list.push(current.data);
            current = current.next;
        }
        
        return list;
    }

    return { enQueue, deQueue, front, back, getSize, toArray };
}