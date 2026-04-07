export class MaxHeap<T extends { severity: number }> {
    private heap: T[] = [];

    push(item: T): void {
        this.heap.push(item);
        this.siftUp(this.heap.length - 1);
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        if (this.heap.length === 1) return this.heap.pop();

        const root = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.siftDown(0);
        return root;
    }

    peek(): T | undefined {
        return this.heap[0];
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    getAll(): T[] {
        // Return a copy so it isn't mutated
        return [...this.heap];
    }

    private siftUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].severity <= this.heap[parentIndex].severity) break;
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    private siftDown(index: number): void {
        while (true) {
            let largest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && this.heap[leftChild].severity > this.heap[largest].severity) {
                largest = leftChild;
            }
            if (rightChild < this.heap.length && this.heap[rightChild].severity > this.heap[largest].severity) {
                largest = rightChild;
            }

            if (largest === index) break;
            [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
            index = largest;
        }
    }
}
