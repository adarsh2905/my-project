import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface Data {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  allColumns: string[] = ['id', 'name', 'age', 'address'];
  displayedColumns: string[] = [...this.allColumns];
  dataSource = new MatTableDataSource<Data>([
    {id: 1, name: 'John Doe', age: 25, address: '1234 Elm St'},
    {id: 2, name: 'Jane Smith', age: 30, address: '5678 Oak St'},
    {id: 3, name: 'Adarsh Kumar', age: 30, address: 'Patna'},
    {id: 4, name: 'Ayush Kumar', age: 30, address: 'Patna'},
    {id: 5, name: 'Kiran Babu', age: 30, address: 'Vizag'},
    {id: 6, name: 'Abhishek Chimavekar', age: 30, address: 'Pune'},
    {id: 7, name: 'Gangadhar Vengali', age: 30, address: 'Vijawada'},
    {id: 8, name: 'Shahanwaz', age: 30, address: 'Mumbai'},
    // Add more data here
  ]);
  selectedColumns: Set<string> = new Set(this.allColumns);
  pageSizeOptions: number[] = [5, 10, 25, 100];
  totalRecords: number = this.dataSource.data.length;  // total count of records
  pageSize: number = 5;  // default page size
  savedViews: string[] = []; // Array to hold saved views
  currentViewName: string | null = null; // Hold the current view name
  isViewChanged: boolean = false; // Track if the view has been changed

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.totalRecords = this.dataSource.data.length;  // update total records on init
    this.loadSavedViews();  // Load saved views on initialization
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.totalRecords = this.dataSource.filteredData.length;  // update total records on filter
  }

  drop(event: CdkDragDrop<string[]>) {
    const prevIndex = this.displayedColumns.findIndex((d) => d === event.item.data);
    moveItemInArray(this.displayedColumns, prevIndex, event.currentIndex);
    this.isViewChanged = true; // Mark view as changed
  }

  toggleColumn(column: string) {
    if (this.selectedColumns.has(column)) {
      this.selectedColumns.delete(column);
    } else {
      this.selectedColumns.add(column);
    }
    this.displayedColumns = Array.from(this.selectedColumns);
    this.isViewChanged = true; // Mark view as changed
  }

  saveView() {
    const viewName = prompt("Enter view name:");
    if (viewName) {
      localStorage.setItem(`tableView_${viewName}`, JSON.stringify(this.displayedColumns));
      this.loadSavedViews();  // Refresh saved views
      this.currentViewName = viewName;  // Set current view name
      this.isViewChanged = false; // Reset view changed flag
    }
  }

  updateView() {
    if (this.currentViewName) {
      localStorage.setItem(`tableView_${this.currentViewName}`, JSON.stringify(this.displayedColumns));
      this.loadSavedViews();  // Refresh saved views
      alert(`View "${this.currentViewName}" has been updated.`);
      this.isViewChanged = false; // Reset view changed flag
    } else {
      alert('No view is currently selected to update.');
    }
  }

  loadSavedViews() {
    this.savedViews = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tableView_')) {
        this.savedViews.push(key.replace('tableView_', ''));
      }
    }
  }

  loadView(viewId: string) {
    const savedView = localStorage.getItem(`tableView_${viewId}`);
    if (savedView) {
      this.displayedColumns = JSON.parse(savedView);
      this.selectedColumns = new Set(this.displayedColumns);
      this.currentViewName = viewId;  // Set current view name
      this.isViewChanged = false; // Reset view changed flag
    }
  }
}
