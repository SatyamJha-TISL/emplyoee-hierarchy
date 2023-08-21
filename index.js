class EmployeeOrgApp {
    constructor(ceo) {
        this.ceo = ceo;
        this.initializeURCache();
    }
    initializeURCache() {
        this.URCache = {
            undoCount: 0,
            redoCount: 0,
            emp: EmployeeOrgApp.DUMMYEMP,
            oldSup: EmployeeOrgApp.DUMMYEMP,
            newSup: EmployeeOrgApp.DUMMYEMP,
            oldEmpSubs: [],
        };
    }
    // find and store employee and supervisor details and store them in URCache
    findEmp(sup, supID, empID, supFound, empFound) {
        if (supFound && empFound) {
            return;
        }
        sup.subordinates.forEach((emp) => {
            if (emp.uniqueId == empID) {
                // store emp details in cache
                this.URCache.emp = emp;
                this.URCache.oldEmpSubs = [...emp.subordinates];
                this.URCache.oldSup = sup;
                empFound = true;
            }
            if (emp.uniqueId == supID) {
                // store new sup details in cache
                this.URCache.newSup = emp;
                supFound = true;
            }
            this.findEmp(emp, supID, empID, supFound, empFound);
        });
    }
    move(employeeID, supervisorID) {
        if (employeeID === this.ceo.uniqueId) {
            console.log("The provided employee ID is of CEO, which is not applicable for this action. Please enter a different employee ID.");
            return;
        }
        this.findEmp(this.ceo, supervisorID, employeeID, false, false);
        this.URCache.oldSup.subordinates.splice(this.URCache.oldSup.subordinates.indexOf(this.URCache.emp));
        this.URCache.oldSup.subordinates.push(...this.URCache.emp.subordinates);
        this.URCache.emp.subordinates = [];
        this.URCache.newSup.subordinates.push(this.URCache.emp);
        this.URCache.undoCount += 1;
    }
    undo() {
        if (this.URCache.undoCount <= 0) {
            console.log("\nUndo not available!");
            return;
        }
        this.URCache.newSup.subordinates.pop();
        for (let i = 0; i < this.URCache.oldEmpSubs.length; i++) {
            this.URCache.oldSup.subordinates.pop();
        }
        this.URCache.oldSup.subordinates.push(this.URCache.emp);
        this.URCache.emp.subordinates.push(...this.URCache.oldEmpSubs);
        this.URCache.undoCount -= 1;
        this.URCache.redoCount += 1;
    }
    redo() {
        if (this.URCache.redoCount <= 0) {
            console.log("\nRedo not available!");
            return;
        }
        this.URCache.oldSup.subordinates.splice(this.URCache.oldSup.subordinates.indexOf(this.URCache.emp));
        this.URCache.oldSup.subordinates.push(...this.URCache.emp.subordinates);
        this.URCache.emp.subordinates = [];
        this.URCache.newSup.subordinates.push(this.URCache.emp);
        this.URCache.redoCount -= 1;
        // empty the cache
        this.initializeURCache();
    }
}
EmployeeOrgApp.DUMMYEMP = {
    uniqueId: -1,
    name: "Dummy Emp",
    subordinates: [],
};
// testing the app
function printHeirarchy(emp, tabSpace = "") {
    if (tabSpace === "") {
        console.log(ceo.name);
    }
    tabSpace += "\t";
    emp.subordinates.forEach((sub) => {
        console.log(`${tabSpace}-${sub.name}`);
        printHeirarchy(sub, tabSpace);
    });
}
const ceo = {
    uniqueId: 0,
    name: "CEO",
    subordinates: [],
};
const app = new EmployeeOrgApp(ceo);
const emp1 = {
    uniqueId: 1,
    name: "A",
    subordinates: [],
};
const emp2 = {
    uniqueId: 2,
    name: "A1",
    subordinates: [],
};
const emp3 = {
    uniqueId: 3,
    name: "A11",
    subordinates: [],
};
const emp4 = {
    uniqueId: 4,
    name: "A12",
    subordinates: [],
};
const emp5 = {
    uniqueId: 5,
    name: "A121",
    subordinates: [],
};
const emp6 = {
    uniqueId: 6,
    name: "A1211",
    subordinates: [],
};
const emp7 = {
    uniqueId: 7,
    name: "B",
    subordinates: [],
};
const emp8 = {
    uniqueId: 8,
    name: "B1",
    subordinates: [],
};
const emp9 = {
    uniqueId: 9,
    name: "B11",
    subordinates: [],
};
const emp10 = {
    uniqueId: 10,
    name: "B2",
    subordinates: [],
};
const emp11 = {
    uniqueId: 11,
    name: "B3",
    subordinates: [],
};
const emp12 = {
    uniqueId: 12,
    name: "C",
    subordinates: [],
};
const emp13 = {
    uniqueId: 13,
    name: "D",
    subordinates: [],
};
const emp14 = {
    uniqueId: 14,
    name: "D1",
    subordinates: [],
};
ceo.subordinates = [emp1, emp7, emp12, emp13];
emp1.subordinates = [emp2];
emp2.subordinates = [emp3, emp4];
emp4.subordinates = [emp5];
emp5.subordinates = [emp6];
emp7.subordinates = [emp8, emp10, emp11];
emp8.subordinates = [emp9];
emp12.subordinates = [];
emp13.subordinates = [emp14];
// print heirarchy
console.log("ORIGINAL HEIRARCHY:");
printHeirarchy(ceo);
// operations
app.move(2, 7);
console.log("AFTER MOVE HEIRARCHY:");
printHeirarchy(ceo);
app.undo();
console.log("AFTER UNDO HEIRARCHY:");
printHeirarchy(ceo);
app.redo();
console.log("AFTER REDO HEIRARCHY:");
printHeirarchy(ceo);
