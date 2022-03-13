/* 
Implementation of a Stack as a linked list
*/

export const stack = () => {

    let size = 0;
    let head = null;

    function push(data) {

        let newNode = {data : data, next : head};
        head = newNode;
        size++;
    }

    function pop() {
        const oldHead = head;
        head = oldHead.next;
        size--;
        return oldHead.data;
    }

    function top() {
        if ( head ) return head.data;
        return null;
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

    return { push, pop, top, getSize, toArray };
}