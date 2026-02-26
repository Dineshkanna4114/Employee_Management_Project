package com.employeemanagement.controller;

import com.employeemanagement.dto.ApiResponse;
import com.employeemanagement.dto.DashboardStatsDTO;
import com.employeemanagement.dto.EmployeeDTO;
import com.employeemanagement.entity.Employee.EmployeeStatus;
import com.employeemanagement.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EmployeeDTO>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String status) {
        Page<EmployeeDTO> employees = employeeService.getAllEmployees(page, size, sortBy, sortDir, search, departmentId,
                status);
        return ResponseEntity.ok(ApiResponse.success("Employees fetched", employees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Employee fetched", employeeService.getEmployeeById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(@Valid @RequestBody EmployeeDTO dto) {
        EmployeeDTO created = employeeService.createEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(@PathVariable Long id,
            @Valid @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully",
                employeeService.updateEmployee(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully", null));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateStatus(@PathVariable Long id,
            @RequestParam EmployeeStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                employeeService.updateStatus(id, status)));
    }

    @PostMapping("/{id}/upload-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(@PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = employeeService.uploadProfileImage(id, file);
            return ResponseEntity.ok(ApiResponse.success("Profile image uploaded", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", employeeService.getDashboardStats()));
    }
}
