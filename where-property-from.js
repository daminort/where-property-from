'use strict';
/** ------------------------------------------------------------------------------------------------------
 * Классы
 ------------------------------------------------------------------------------------------------------ */
class Human {
    constructor(name) {
        this.name = name;
    }
}

class Man extends Human {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
}

class Student extends Man {
    constructor(name, age, subject) {
        super(name, age);
        this.subject = subject;
    }
}

/** ------------------------------------------------------------------------------------------------------
 * Прототипы
 ------------------------------------------------------------------------------------------------------ */
Human.prototype.getName = function() {
    return this.name;
}
Man.prototype.getAge = function() {
    return this.age;
}
Student.prototype.getSubject = function() {
    return this.subject;
}

/** ------------------------------------------------------------------------------------------------------
 * Вспомогательные функции
 ------------------------------------------------------------------------------------------------------ */
/**
 * Получение иерархии классов объекта
 * @param {object} obj объект, для которого строится иерархия классов
 * @param {array} hierarchy массив, содержащий классы. Необходимо передавать только при рекурсивных вызовах
 * @return {array} массив, содержащий классы: от последнего потомка до главного предка
 */
function getClassHierarchy(obj, hierarchy) {
    
    hierarchy = ( hierarchy || [] );

    if (obj === null || obj.__proto__ === null || obj.__proto__.constructor === null) {
        return hierarchy;
    };

    hierarchy.push(obj.__proto__.constructor);
    if (obj.__proto__.constructor.prototype) {
        // уходим в рекурсию: на уровень выше
        getClassHierarchy(obj.__proto__.constructor.prototype, hierarchy);
    };    
    return hierarchy;
};

/** ------------------------------------------------------------------------------------------------------
 * Основная функция: Чье же это свойство?
 ------------------------------------------------------------------------------------------------------ */
/**
 * Получение имени класса, который содержит реализацию метода или свойство
 * @param {object} obj исходный объект, для которого производится поиск владельца свойства/метода
 * @param {string} propertyName имя искомого свойства или метода
 * @return {string} строковое представление класса, в котором присутствует реализация искомого метода или свойство
 */
function getPropertyOwner(obj, propertyName) {

    if (obj === null) {
        return null;
    };

    // получим иерархию классов объекта
    let classHierarchy = getClassHierarchy(obj);

    // проверяем у самого объекта
    let props = Object.getOwnPropertyNames(obj);
    if ( props.indexOf(propertyName) !== -1 ) {
        return obj.constructor.name;

    } else {
        // сначала получим класс объекта
        let objClass = null;
        for (let i = 0; i < classHierarchy.length; i++) {
            objClass = classHierarchy[i];
            if (obj instanceof objClass) {
                break;
            };
        };    
        if (objClass === null) {
            return 'Object';
        }
        // теперь проверяем наличие необходимого свойства
        let objProps = Object.getOwnPropertyNames(objClass);
        if ( objProps.indexOf(propertyName) !== -1 ) {
            return objClass.constructor.name;
        } else {
            // уходим в рекурсию: на уровень выше
            return getPropertyOwner(objClass.prototype, propertyName);
        };
    };
};
/** ------------------------------------------------------------------------------------------------------
 * Основная программа
 ------------------------------------------------------------------------------------------------------ */
let john = new Student('Джон Сноу', 20, 'История Севера');

let johnName = `Привет! Я - ${john.getName()}.`;
let johnAge = `Мне ${john.getAge()} лет.`;
let johnSubject = `Я изучаю предмет "${john.getSubject()}" в академии Винтерфелла`;

let ageOwner = getPropertyOwner(john, 'age');
let getSubjectOwner = getPropertyOwner(john, 'getSubject');
let getAgeOwner = getPropertyOwner(john, 'getAge');
let getNameOwner = getPropertyOwner(john, 'getName');
let toStringOwner = getPropertyOwner(john, 'toString');

console.dir( john );
console.log( johnName );
console.log( johnAge );
console.log( johnSubject );
console.log( '----' );
console.log( 'Владелец свойства age: ' + ageOwner );                // Student
console.log( 'Владелец метода getSubject: ' + getSubjectOwner );    // Student
console.log( 'Владелец метода getAge: ' + getAgeOwner );            // Man
console.log( 'Владелец метода getName: ' + getNameOwner );          // Human
console.log( 'Владелец метода toString: ' + toStringOwner );        // Object
