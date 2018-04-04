import { Injectable} from '@angular/core'
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/filter'
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";

@Injectable()
export class SharedWorkerService {
    protected worker: SharedWorker.SharedWorker

    protected _id: BehaviorSubject<any> = new BehaviorSubject(null)
    id: Observable<any> = this._id.asObservable().filter(value => Boolean(value))

    protected _message: Subject<any> = new Subject()
    message: Observable<any> = this._message.asObservable().filter(value => Boolean(value))

    constructor() {
        this.worker = new SharedWorker("/dist-ng/devxpress/tools/shared-worker.js", "second-screen")
        this.connect()
    }

    getWorker() {
        return this.worker
    }

    /**
     *
     * @returns {Subject<any>}
     */
    protected connect(): void {
        let id = null;
        this.worker.port.addEventListener("message", e => {
            const data = e.data

            if (!data
            || typeof data.id === 'undefined') {
                throw new Error('message received without id')
            }

            console.log('worker id is', id)
            if (data.cmd === 'connected'
                && !(id != null)) {
                id = data.id;
                this._id.next(id)
                console.log('got id of', id)
                return
            }

            this._message.next(data)
            console.log('window connected with id', data)
        })

        this.worker.port.start()
    }

    ping() {
        const message = {id: this._id.getValue(), type: "ping", message: "whatever"}
        this.worker.port.postMessage(message)
    }
}
