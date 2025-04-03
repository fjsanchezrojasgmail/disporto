import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static dniValidator(control: AbstractControl): ValidationErrors | null {
        const dni = control.value;

        // Validación básica de longitud
        if (!dni || dni.length !== 9) {
            return { invalidDni: true };
        }

        // Validación de formato
        const dniRegex = /^[0-9]{8}[A-Za-z]$/;
        if (!dniRegex.test(dni)) {
            return { invalidDni: true };
        }

        // Validación del dígito de control (letra)
        const letter = dni.charAt(8).toUpperCase();
        const numberPart = dni.substring(0, 8);
        const letterArray = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const calculatedLetter = letterArray[parseInt(numberPart, 10) % 23];

        if (letter !== calculatedLetter) {
            return { invalidDni: true };
        }

        // Si todas las validaciones pasan, retorna null
        return null;
    }

    static phoneValidator(control: AbstractControl): ValidationErrors | null {
        const phoneNumber = control.value;

        // Validación básica de longitud, solo si esta definido
        if (phoneNumber && phoneNumber.toString().length !== 9) {
            return { invalidPhone: true };
        }

        //Solo se usa en un inputNumber, sino se debe comprobar que es un numero bien formado

        // Si todas las validaciones pasan, retorna null
        return null;
    }
}