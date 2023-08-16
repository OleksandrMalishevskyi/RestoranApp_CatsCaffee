import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../shared/services/categories.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.css']
})
export class OrderCategoriesComponent implements OnInit {

  categories$!: Observable<Category[]>;

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch().pipe(
      map(categories => categories.sort((a, b) => a.name.localeCompare(b.name)))
    );
  }
}
