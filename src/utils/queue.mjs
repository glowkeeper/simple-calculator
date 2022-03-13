/* 
Implementation of a Queue as a double linked list
*/

export const queue = () => {

    let size = 0;
    let head, rear = null;

    function enQueue(data) {

        let newNode = {data : data, next : rear, previous: null};

        if (!head) {
            head = newNode;
            rear = newNode;
        } else {
            rear.previous = newNode;
            rear = newNode;
        }

        size++;
    }

    function deQueue() {
        const thisHead = head;
        const nextHead = head.previous;
        head = nextHead;
        size--;
        return thisHead.data;
    }

    function getSize() {
        return size;
    }

    function toArray() {

        const list = [];
        let current = head;
        while (current) {
            list.push(current.data);
            current = current.previous;
        }
        
        return list;
    }

    return { enQueue, deQueue, getSize, toArray };
}