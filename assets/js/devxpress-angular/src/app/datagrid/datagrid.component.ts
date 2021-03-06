import { Component, OnInit } from '@angular/core'
import { ApiService } from "../../services/api"
import CustomStore from 'devextreme/data/custom_store';
import {BookModel} from "../../models/book.model";
import 'rxjs/add/operator/toPromise';
import { apiConfig } from '../../../../lib/config'
import {ListAbstractReviver} from '@rebolon/json-reviver/src'

@Component({
  selector: 'my-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})
export class DatagridComponent implements OnInit {
  protected books: BookModel
  protected booksTotal: number

  protected apiConfig
  protected dataSource: any = {}

  constructor(private api: ApiService) {
      this.apiConfig = apiConfig

      // @todo: the store should be moved into services folder and injected here instead of the ApiService
      this.dataSource.store = new CustomStore({
          load: (loadOptions: any) => {
              let itemPerPage = this.apiConfig.itemsPerPage

              let options = {
                  params: []
              }

              // manage number of items wished by the datagrid and that the API must return (take care to configure the config/packages/api_platform.yaml:client_items_per_page key)
              if(loadOptions.take) {
                  options.params[this.apiConfig.itemsPerPageParameterName] = loadOptions.take
                  itemPerPage = loadOptions.take
              }

              // manage the pagination: ApiPlatform works with hydra system and so a page number whereas DevXpress datagrid uses a skip/take parameter, so it requires a small Math calc
              if(loadOptions.skip) {
                  options.params['page'] = loadOptions.skip > 0 ? Math.ceil(loadOptions.skip / itemPerPage) +1 : 1
              }

              if(loadOptions.sort && loadOptions.sort.length) {
                  loadOptions.sort.forEach(sort => {
                      options.params[`order[${sort.selector}]`] = sort.desc ? 'desc' : 'asc'
                  })
              }

              return this.api.get('/books', options)
                  .toPromise()
                  .then(json => {
                      // not mandatory
                      this.books = json['hydra:member']
                      this.booksTotal = json['hydra:totalItems']

                      return {
                          data: json['hydra:member'],
                          totalCount: json['hydra:totalItems']
                      }
                  })
                  .catch(error => {
                      console.log(error)
                      throw 'Data Loading Error'
                  })
          },
          update: (key: any, values: any) => {
              return this.api.put(`/books/${key.id}`, values)
                  .toPromise()
                  .then(() => {
                      console.info('Update Ok')
                  })
                  .catch(e => {
                      console.warn(e)
                      throw 'Data Update Error'
                  })
          },
          remove: (key: any) => {
              return this.api.delete(`/books/${key.id}`)
                  .toPromise()
                  .then(() => {
                      console.info('Delete Ok')
                  })
                  .catch(e => {
                      console.warn(e)
                      throw 'Data Delete Error'
                  })
          }
      })
  }

  ngOnInit(): void {
    /*
    this.api.get('/books', {params: {"order[id]": 'DESC'}}).subscribe((books) => {
      this.books = books['hydra:member']
    })
    */
  }

  debug(data: any): void {
      console.log(data)
  }
}
