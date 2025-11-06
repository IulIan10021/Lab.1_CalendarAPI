const { validate, IsString, IsDateString, IsOptional, Length } = require("class-validator");

class CreateEventDto {
    constructor(name, student, date, location, description) {
        this.name = name;
        this.student = student;
        this.date = date;
        this.location = location;
        this.description = description;
    }

    static getValidators() {
        return {
            name: [IsString(), Length(3, 50)],
            student: [IsString(), Length(3, 50)],
            date: [IsDateString()],
            location: [IsOptional(), IsString()],
            description: [IsOptional(), IsString()]
        };
    }
}

module.exports = CreateEventDto;
