package com.employeemanagement.controller;

import com.employeemanagement.dto.ApiResponse;
import com.employeemanagement.dto.DepartmentDTO;
import com.employeemanagement.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success("Departments fetched", departmentService.getAllDepartments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Department fetched", departmentService.getDepartmentById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody DepartmentDTO dto) {
        DepartmentDTO created = departmentService.createDepartment(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(@PathVariable Long id,
            @Valid @RequestBody DepartmentDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully",
                departmentService.updateDepartment(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }
}
