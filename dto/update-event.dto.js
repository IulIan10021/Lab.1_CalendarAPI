const { IsString, IsDateString, IsOptional, Length } = require("class-validator");

class UpdateEventDto {
    constructor(name, student, date, location, description) {
        this.name = name;
        this.student = student;
        this.date = date;
        this.location = location;
        this.description = description;
    }

    static getValidators() {
        return {
            name: [IsOptional(), IsString(), Length(3, 50)],
            student: [IsOptional(), IsString(), Length(3, 50)],
            date: [IsOptional(), IsDateString()],
            location: [IsOptional(), IsString()],
            description: [IsOptional(), IsString()]
        };
    }
}

module.exports = UpdateEventDto;
