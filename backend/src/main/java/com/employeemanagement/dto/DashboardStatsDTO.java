package com.employeemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long totalDepartments;
    private Map<String, Long> departmentStats;
    private double averageSalary;
    private long newJoineesThisMonth;
}
