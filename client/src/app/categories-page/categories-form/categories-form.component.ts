import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {ActivatedRoute, Params, Router} from '@angular/router'
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CategoriesService } from "../../shared/services/categories.service";
import { switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { MaterialService } from "../../shared/classes/material.service";
import { Category } from "../../shared/interfaces";

@Component({
  selector: "app-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.css"],
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild("input") inputRef!: ElementRef;
  form!: FormGroup;
  image!: File;
  imagePreview = "";
  isNew = true;
  category!: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }


  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params["id"]) {
            this.isNew = false;
            return this.categoriesService.getById(params["id"]);
          }

          return of(null);
        })
      )
      .subscribe(
        (category: Category | null) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc || "";
            MaterialService.updateTextInputs();
          }

          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

deleteCategory() {
  const decision = window.confirm(`Are you sure you want to delete the category"${this.category.name}"`);

  if (decision) {
    const categoryId = this.category._id;

    categoryId
      ? this.categoriesService.delete(categoryId).subscribe(
          (response) => {
            MaterialService.toast(response.message);
            this.router.navigate(['/categories']);
          },
          (error) => MaterialService.toast(error.error.message)
        )
      : MaterialService.toast('The category ID is undefined.');
  }
}


  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(
        this.form.value.name as string,
        this.image
      );
    } else {
      if (this.category && this.category._id) {
        obs$ = this.categoriesService.update(
          this.category._id,
          this.form.value.name as string,
          this.image
        );
      }
    }

    if (obs$) {
      obs$.subscribe(
        (category: any) => {
          this.category = category;
          MaterialService.toast("The changes have been saved.");
          this.form.enable();
        },
        (error: any) => {
          MaterialService.toast(error.error.message);
          this.form.enable();
        }
      );
    }
  }
}
