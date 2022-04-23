// Copyright 2022 Winter/Vortetty
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef MINDUSTRY_H
#define MINDUSTRY_H
struct MindustryObject {};
// builtin instructions
void print(char* s);
void printd(double s);
void printflush(struct MindustryObject message);

struct MindustryObject radar(struct MindustryObject obj, char* target1, char* target2,
                             char* target3, char* sort, double index);
double sensor(struct MindustryObject obj, char* prop);
void enable(struct MindustryObject obj, double enabled);
void shoot(struct MindustryObject obj, double x, double y, double shoot);

struct MindustryObject get_link(double index);
double read(struct MindustryObject cell, double index);
void write(double val, struct MindustryObject cell, double index);

void drawclear(double r, double g, double b);
void drawcolor(double r, double g, double b);
void drawstroke(double width);
void drawline(double x1, double y1, double x2, double y2);
void drawrect(double x, double y, double w, double h);
void drawlinerect(double x, double y, double w, double h);
void drawpoly(double x, double y, double sides, double radius, double rotation);
void drawlinepoly(double x, double y, double sides, double radius, double rotation);
void drawtriangle(double x1, double y1, double x2, double y2, double x3, double y3);
void drawflush(struct MindustryObject display);

void end();

// builtin binary operators
double pow(double x, double y);
double max(double x, double y);
double min(double x, double y);
double atan2(double x, double y);
double dst(double x, double y);
// builtin unary operators
double abs(double x);
double log(double x);
double log10(double x);
double sin(double x);
double cos(double x);
double tan(double x);
double floor(double x);
double ceil(double x);
double sqrt(double x);
double rand(double x);
#endif